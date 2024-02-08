class NewProject {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLInputElement;
    element: HTMLFormElement;

    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLInputElement;
       
        const insertedElemet = document.importNode(this.templateElement.content, true);

        this.element = insertedElemet.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';


        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

        this.configur();
        this.attach();
       
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }


    private collectAllUserData() {
        const titleData = this.titleInputElement.value;
        const descriptionData = this.descriptionInputElement.value;
        const peopleData = this.peopleInputElement.value;

        if(
            titleData.trim().length === 0 ||
            descriptionData.trim().length === 0 ||
            peopleData.trim().length === 0 
        ) {
            alert('Please enter valid valuse in the form!');
            return;
        } else {
            return [titleData, descriptionData, +peopleData];
        }
    }

    private submitHandler(event: Event) {
        event.preventDefault();
        //console.log(this.titleInputElement.value);

        const userInput = this.collectAllUserData();

        // do some additional checks and append

        if(Array.isArray(userInput)){
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            this.clean();
        }   
    }

    private configur(){
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }

    private clean(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

}

const importNewProjec = new NewProject();


console.log("Connection is correct...");