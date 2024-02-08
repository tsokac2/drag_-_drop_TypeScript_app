class ProjectInput_3 {
  inputTemplateElement: HTMLTemplateElement;
  hostTemplate: HTMLInputElement;
  elemet: HTMLFormElement;

  constructor() {
    this.inputTemplateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostTemplate = document.getElementById("app")! as HTMLInputElement;

    const importedNode = document.importNode(
      this.inputTemplateElement.content,
      true
    );

    this.elemet = importedNode.firstElementChild as HTMLFormElement;

    this.attach();
  }

  private attach() {
    this.hostTemplate.insertAdjacentElement("afterbegin", this.elemet);
  }
}

const prInput_3 = new ProjectInput_3();
