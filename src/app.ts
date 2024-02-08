// Define Autobind decorator - Tomislav
function autobind(
    _: any,
    _2: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    return {
        configurable: true,  // Add the 'configurable' property
      get() {
        const boundFn = originalMethod.bind(this);
        return boundFn;
      }
    };
  }



// Main ProjectInput Class - Tomislav

class ProjectInput { //showing form in the Html Templat element

    templateElement: HTMLTemplateElement; // Set type of templateElement
    hostElement: HTMLDivElement; // Set type of hostElement
    element: HTMLFormElement; // Set type of element

    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;


    // Class constructor
    constructor(){
        this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement; //what you fetch here will not be null and it will be of that type
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);

        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input'; //adding id with css styling

        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

        this.configure();
        this.attach();
    }

    // Collect users input from the front-end

    private gatherUserInput(): [string, string, number] | void {//type tuple or void (reeplacment for a undefind)
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        if (
            enteredTitle.trim().length === 0 ||
            enteredDescription.trim().length === 0 ||
            enteredPeople.trim().length === 0
        ) {
            alert("Invalid input, please try again!");
            return;
        } else {
            
            return [enteredTitle, enteredDescription, +enteredPeople]; // +enteredPeople converting to a number
        }
    }

    // after button is submited clear the form
    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }


    // using the decorator when submiting the form 
    @autobind

    private submitHandler(event: Event) {
        event.preventDefault(); //preventing default subbision by the browser
        // console.log(this.titleInputElement.value); // logs in the console content of the id="title" element
      const userInput = this.gatherUserInput();

        if(Array.isArray(userInput)){
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            this.clearInputs();
        }
    }
    

    // Connecting submitHandelr method to the button in the HTML - with the type 'submit' -  using the bind method to avoid an errors
    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }


    // Attaching template element to the the host element that is rendering template form element to the DOM
    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}


// Creating and calling a new calss and rendering elemetn to the DOM
const prInput = new ProjectInput();


// Cheking the compiler conneciton 
console.log("Cheking...App_TS");
