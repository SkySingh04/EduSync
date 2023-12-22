export type Day= String;
export type Time= String;

export type Teacher = {
    name: String,
    id: String,
    subject: String
}

export type Student = {
    name: String,
    id: String,
    subject: String
}
export type SlotData = Record<string, { teachers: Teacher[], students: Student[] }>;