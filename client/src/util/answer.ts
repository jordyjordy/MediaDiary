export class Answer {
    image: any
    recordings: QuestionPart[]
    text: QuestionPart[]

    constructor(image: any[], recordings: QuestionPart[], text: QuestionPart[]) {
        this.image = image
        this.recordings = recordings
        this.text = text
    }
}

export class QuestionPart {
    id: number
    data: File[]
    constructor(id: number, data: any) {
        this.id = id
        this.data = data
    }

}
