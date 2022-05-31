import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import useStaleRefresh from "./useStaleRefresh";

// FIRST STEP: Mock the fetch function
// To have control over what the API returns


// This assumes response type is always JSON
// By default returns the parameter url and data value 
// Also, adds a random delay between 200ms and 500ms to the response 
function fetchMock(url, suffix = "") {
  return new Promise((resolve) => 
    setTimeout(() => {
      resolve({
        json: () =>
        Promise.resolve({
          data: url + suffix,
        }),
      });

    }, 200 + Math.random() * 300)
  );
}

// SECOND STEP: before each test, mock the fetch function
beforeAll(() => {
  jest.spyOn(global, "fetch").mockImplementation(fetchMock);
});

// THIRD STEP: after each test, clean up the mock
afterEach(() => {
  global.fetch.mockClear();
});

// beforeEach and afterEach to mount and unmount our component for each test
// we want to start with a fresh DOM before each test.

let container = null; // Global variable

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// TEST: First test we will render a URL and since fetching the URL takes some time, 
// we will see the loading text render first.

it("useStaleRefresh hook runs correctly", () => {
  act(() => {
    render(<TestComponent url="url1" />, container);
  });
  expect(container.textContent).toBe("Loading...");
})

// FOURTH STEP: Mount the hook in a component.
  // Hooks are just funtions on their own. 
  // Only when used in components can they respond to useState, useEffect, etc.

// FIFTH STEP: Create a TestComponent that helps us mount our hook.

// defaultValue is a global variable to avoid changing the object pointer on re-render
// we can also deep compare `defaultValue` inside the hook's useEffect
const defaultValue = { data: "" };
// Simple component that either renders the data or renders a "Loading" text prompt if data is loading (being fetched).
function TestComponent({ url }) {
  const [data, isLoading] = useStaleRefresh(url, defaultValue);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div>{data.data}</div>;
}