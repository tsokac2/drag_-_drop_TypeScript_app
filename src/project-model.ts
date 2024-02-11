namespace App {
  // Project Type enums
  export enum ProjectStatus {
    Active,
    Finished,
  }

  // #4 - CLASS for individual Project
  export class Project {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public people: number,
      public status: ProjectStatus
    ) {}
  }
}
