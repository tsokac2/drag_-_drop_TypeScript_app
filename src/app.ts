
//Drag & Drop Interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {

  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;

}


// Project Type enums

enum ProjectStatus {Active, Finished}

// #4 - CLASS for individual Project
class Project {
    constructor(
        public id: string, 
        public title:string, 
        public description: string, 
        public people: number, 
        public status: ProjectStatus )
        {}
}





// #3 - CLASS Project State Managment Global Class for managing State 
// Project State Management

type Listener<T> = (items: T[]) => void;


// Base State Class
class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

// Project State Component
class ProjectState extends State<Project>{
    

    private projects: Project[] = [];
    private static instance: ProjectState;
   

    private constructor(
       
    ) { super();}

   

    static getInstance() {
        if(this.instance) {
            return this.instance;
        }

        this.instance = new ProjectState();
        return this.instance
    }

    addProject(title: string, description:string, numOfPeople: number) {

        const newProject = new Project (
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );

        this.projects.push(newProject);

        this.updateListeners();
    }


    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find(prj => prj.id === projectId);

      if(project){
        project.status = newStatus;
        this.updateListeners();
      }
    }

    private updateListeners() {

      for(const listenerFn of this.listeners) {
        listenerFn(this.projects.slice());
    }
    }

}

// Global constant that can talk to any class in the application


const projectState = ProjectState.getInstance();


// Validation logic that can me implemented acros the project in different parts of the app
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

// validate function controler using Validatable interface as a type
function validate(validatableInput: Validatable) {

    let isValid = true;

    if (validatableInput.required){
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }

    if (validatableInput.minLength != null && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength; 
    }

    if (validatableInput.maxLength != null && typeof validatableInput.value === "string") {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength; 
    }

    if (validatableInput.min != null && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value >= validatableInput.min; 
    }

    if (validatableInput.max != null && typeof validatableInput.value === "number") {
        isValid = isValid && validatableInput.value <= validatableInput.max; 
    }

    return isValid;
}


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



// #1 - CLASS Main ProjectInput Class for rendering Main Template
// CLASS - Master class that will store all the data that is repeted acrose another classes
// Component Base Class

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement; // Set type of templateElement
    hostElement: T; // Set type of hostElement
    element: U; // Set type of element
  
    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.templateElement = document.getElementById(
        templateId
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById(hostElementId)! as T;
  
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.element = importedNode.firstElementChild as U;
  
      if (newElementId) {
        this.element.id = newElementId;
      }
  
      this.attach(insertAtStart);
    }
  
    private attach(insertAtBeginning: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtBeginning ? "afterbegin" : "beforeend",
        this.element
      );
    }
  
    abstract configure(): void;
    abstract renderContent(): void;
  
  }

// ProjectInput Class

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
//#---------------------------------------------------------#



// ProjectItem Class

class ProjectItme extends Component<HTMLUListElement, HTMLElement> implements Draggable {

  private project: Project;

  get persons() {
    
    if(this.project.people === 1){
      return '1 person';
    } else {
      return `${this.project.people} persons`; 
    }
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);

    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(_: DragEvent) {
    console.log('DragEnd');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragStartHandler);
  }

  renderContent(){
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }

}


//#---------------------------------------------------------#
// #2 - CLASS Rendering Project List Calss
// ProjectList Class 

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    // assing a dynamic calss for different part of the imported elements
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active: ProjectStatus: );

  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure(){

    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });

      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId; // creating an ID for the 'ul' element  - ! means that ul will not be null
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }


  renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = "";

    for (const prjItem of this.assignedProjects) {
        new ProjectItme(this.element.querySelector('ul')!.id, prjItem);
    }
  }
}


// #-------------------------------------------------# 

// Creating and calling a new calss and rendering elemetn to the DOM
const prInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');


// Cheking the compiler conneciton 
console.log("Cheking...App_TS");


