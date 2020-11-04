import React from "react";

import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  
  it("loads data, books an interview and reduces the spots remaining for monday by 1", async () => {
    const { container } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter your name/i), {
      target: {value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the first appointment with Archie Cohen.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));
    // 4. Check that confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    // 5. Click the "Confirm" button.
    fireEvent.click(queryByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the text "Add" button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Renders the application
    const { container, debug } = render(<Application />);
    // 2. Wait until Archie Cohen is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click on the "Edit" button on the appointment with Archie Cohen.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Edit"));
    // 4. Check that there is a placeholder for "Enter your name"
    expect(getByPlaceholderText(appointment, "Enter your name")).toBeInTheDocument();
    // 5. Change student name to Lydia, pick interviewer and save appointment
    fireEvent.change(getByPlaceholderText(appointment, /enter your name/i), {
      target: {value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Check that element with "Saving" is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 7. Wait until element with Lydia is displayed.
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    // 8. Check that Monday still has 1 spot remaining
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    // 1. Renders the Application.
    const { container } = render(<Application />);
    // 2. Wait until Archie Cohen is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Add a new interview.
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    // 4. Input name and pick interviewer
    fireEvent.change(getByPlaceholderText(appointment, /enter your name/i), {
      target: {value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // 5. Click the save button with a mock rejection
    axios.put.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Check that element with "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 7. Check that the saving error is displayed
    await waitForElement(() => queryByText(appointment, "Error Saving"));
  });

  it("Shows the delete error when failing to delete an existing appointment", async () => {
    // 1. Renders the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until Archie Cohen is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the first appointment with Archie Cohen.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"));
    // 4. Check that confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    // 5. Click the "Confirm" button.
    axios.delete.mockRejectedValueOnce();
    fireEvent.click(queryByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Check that the deleting error is displayed
    await waitForElement(() => queryByText(appointment, "Error Deleting"));
  });
})
