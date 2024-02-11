import { Component } from "./base-components.js";
import { Validatable, validate } from "../util/validation.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  //showing form in the Html Templat element

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  // Class constructor
  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler.bind(this));
  }

  renderContent() {}

  // Collect users input from the front-end

  private gatherUserInput(): [string, string, number] | void {
    //type tuple or void (reeplacment for a undefind)
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // Constructing validable objects base on the validate function and validable interface

    //Object for validating the title
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
      minLength: 3,
    };

    //Object for validating description
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    //Object for validating people
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 8,
    };

    // Final validation
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]; // +enteredPeople converting to a number
    }
  }

  // after button is submited clear the form
  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  // using the decorator when submiting the form
  @autobind
  private submitHandler(event: Event) {
    event.preventDefault(); //preventing default subbision by the browser
    // console.log(this.titleInputElement.value); // logs in the console content of the id="title" element
    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);

      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  // Connecting submitHandelr method to the button in the HTML - with the type 'submit' -  using the bind method to avoid an errors

  // Move to base Component class - Attaching template element to the the host element that is rendering template form element to the DOM -
  // private attach() {
  //     this.hostElement.insertAdjacentElement('afterbegin', this.element);
  // }
}
