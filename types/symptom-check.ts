export type SymptomCategory = "urinary" | "kidney" | "menstrual" | "genital" | "testicular" | "general";
export type SymptomOption = { id:string; label:string; description:string; category:SymptomCategory; icon:string };
export type DurationOption = "today" | "1-3-days" | "4-7-days" | "more-than-week";
export type Severity = 1 | 2 | 3 | 4 | 5;
export type AssessmentInput = { symptoms:string[]; duration:DurationOption; severity:Severity; fever:boolean; blood:boolean; vomiting:boolean; fainting:boolean; unableToUrinate:boolean; suddenSevereTesticularPain:boolean };
export type AssessmentResult = { urgency:"self-care"|"soon"|"urgent"; urgencyTitle:string; urgencyDescription:string; possiblePatterns:string[]; prevention:string[]; recovery:string[]; redFlags:string[]; followUp:string };
