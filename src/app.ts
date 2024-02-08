class ProjectInput { //showing form in the Html Templat element

    templateElement: HTMLTemplateElement; // Set type of templateElement
    hostElement: HTMLDivElement; // Set type of hostElement
    element: HTMLFormElement; // Set type of element
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;


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

    private submitHandler(event: Event) {
        event.preventDefault(); //preventing default subbision by the browser
        console.log(this.titleInputElement.value); // logs in the console content of the id="title" element
      
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const prInput = new ProjectInput();


console.log("Cheking...App_TS");
