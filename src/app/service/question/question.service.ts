import { Injectable } from '@angular/core';
import { DropdownQuestion } from '../../model/questions/question-dropdown';
import { QuestionBase } from '../../model/questions/question-base';
import { TextboxQuestion } from '../../model/questions/question-textbox';
import { Observable, of } from 'rxjs';

@Injectable()
export class QuestionService {

  getLoginQuestions() {
    const questions: QuestionBase<string>[] = [
      new TextboxQuestion({
        key: "email",
        label: "Email",
        required: true,
        type: "email",
      }),
      new TextboxQuestion({
        key: "password",
        label: "Password",
        required: true,
        type: "password",
      })
    ]
    return of(questions.sort((a, b) => a.order - b.order));;
  }
  getRegisterQuestions(): Observable<QuestionBase<string>[]> {
    return of([
      new TextboxQuestion({
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        order: 1,

      }),
      new TextboxQuestion({
        key: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        order: 2,
      }),
      new TextboxQuestion({
        key: 'jmbg',
        label: 'JMBG. If no JMBG, leave empty',
        type: 'text',
        order: 3,
        validators: ['minLength:13', 'maxLength:13', 'pattern:^\\d{13}$'],
      }),
      new TextboxQuestion({
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        order: 4,
        validators: ['required', 'minLength:6'],
      }),
      new TextboxQuestion({
        key: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        required: true,
        order: 5,
        validators: ['required', 'minLength:6', 'match:password'],
      }),
    ].sort((a, b) => a.order - b.order));
  }


  getUserQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'name', label: 'Name', required: true, order: 1 }),
      new TextboxQuestion({ key: 'jmbg', label: 'JMBG', order: 2 }),
      new TextboxQuestion({ key: 'email', label: 'Email', required: true, order: 3 }),
      new TextboxQuestion({ key: 'password', label: 'Password', required: true, order: 4 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getRegisteredUserQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getStudentsQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'addressId', type: 'number', label: 'Address ID', order: 1 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getAdministratorQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'accessLevel', label: 'Access Level', required: true, order: 1 }),
      new TextboxQuestion({ key: 'email', label: 'Email', required: true, order: 2 }),
      new TextboxQuestion({ key: 'password', label: 'Password', required: true, order: 3 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getRoleQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'name', label: 'Role Name', required: true, order: 1 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getMessageQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'dateSent', label: 'Date Sent', type: 'date', required: true, order: 1 }),
      new TextboxQuestion({ key: 'content', label: 'Content', required: true, order: 2 }),
      new TextboxQuestion({ key: 'senderId', label: 'Sender ID', type: 'number', required: true, order: 3 }),
      new TextboxQuestion({ key: 'receiverId', label: 'Receiver ID', type: 'number', required: true, order: 4 }),
      new TextboxQuestion({ key: 'attachmentIds', label: 'Attachment IDs (comma-separated)', type: 'text', order: 5 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getNotificationQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'title', label: 'Title', required: true, order: 1 }),
      new TextboxQuestion({ key: 'content', label: 'Content', required: true, order: 2 }),
      new TextboxQuestion({ key: 'timePosted', label: 'Time Posted', type: 'datetime-local', required: true, order: 3 }),
      new TextboxQuestion({ key: 'courseRealizationId', label: 'Course Realization ID', type: 'number', order: 4 }),
      new TextboxQuestion({ key: 'teacherOnCourseId', label: 'Teacher On Course ID', type: 'number', order: 5 }),
      new TextboxQuestion({ key: 'attachmentIds', label: 'Attachment IDs (comma-separated)', type: 'text', order: 6 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getAddressQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'address', label: 'Street Address', required: true, order: 1 }),
      new TextboxQuestion({ key: 'number', label: 'Number', required: true, order: 2 }),
      new TextboxQuestion({ key: 'city', label: 'City', required: true, order: 3 }),
      new TextboxQuestion({ key: 'country', label: 'Country', required: true, order: 4 }),
      new TextboxQuestion({ key: 'universityId', label: 'University ID', type: 'number', order: 5 }),
      new TextboxQuestion({ key: 'facultyId', label: 'Faculty ID', type: 'number', order: 6 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getTitleQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'selectionDate', label: 'Selection Date', type: 'date', order: 1 }),
      new TextboxQuestion({ key: 'endDate', label: 'End Date', type: 'date', order: 2 }),
      new TextboxQuestion({ key: 'teacherId', label: 'Teacher ID', type: 'number', order: 3 }),
      new TextboxQuestion({ key: 'scientificFieldIds', label: 'Scientific Field IDs (comma-separated)', type: 'text', order: 4 }),
      new TextboxQuestion({ key: 'titleTypeIds', label: 'Title Type IDs (comma-separated)', type: 'text', order: 5 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getTitleTypeQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'name', label: 'Title Name', required: true, order: 1 }),
      new TextboxQuestion({ key: 'titleId', label: 'Related Title ID', type: 'number', order: 2 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getScientificFieldQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'name', label: 'Scientific Field Name', required: true, order: 1 }),
      new TextboxQuestion({ key: 'titleId', label: 'Associated Title ID', type: 'number', order: 2 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getUserOnForumQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getTopicQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'name', label: 'Topic Name', required: true, order: 1 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getForumQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new DropdownQuestion({
        key: 'javni',
        label: 'Is Public',
        options: [
          { id: 1, naziv: 'Yes' },
          { id: 0, naziv: 'No' }
        ],
        required: true,
        order: 1
      })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getPostQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'postingTime', label: 'Posting Time', type: 'datetime-local', required: true, order: 1 }),
      new TextboxQuestion({ key: 'content', label: 'Content', type: 'text', required: true, order: 2 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getFileQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'description', label: 'Description', required: true, order: 1 }),
      new TextboxQuestion({ key: 'url', label: 'File URL', required: true, order: 2 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getStudyProgramQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'name', label: 'Program Name', required: true, order: 1 }),
      new TextboxQuestion({ key: 'leaderId', label: 'Leader ID', type: 'number', required: true, order: 2 }),
      new TextboxQuestion({ key: 'facultyId', label: 'Faculty ID', type: 'number', required: true, order: 3 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getStudyYearQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'enrollmentDate', label: 'Enrollment Date', type: 'date', required: true, order: 1 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getStudentInYearQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'enrollmentDate', label: 'Enrollment Date', type: 'date', required: true, order: 1 }),
      new TextboxQuestion({ key: 'indexNumber', label: 'Index Number', required: true, order: 2 }),
      new TextboxQuestion({ key: 'studentId', label: 'Student ID', type: 'number', order: 3 }),
      new TextboxQuestion({ key: 'studyYearId', label: 'Study Year ID', type: 'number', order: 4 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getTeacherQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'addressId', label: 'Address ID', type: 'number', order: 1 }),
      new TextboxQuestion({ key: 'biography', label: 'Biography', type: 'text', order: 2 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getFacultyQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'name', label: 'Faculty Name', required: true, order: 1 }),
      new TextboxQuestion({ key: 'deanId', label: 'Dean ID', type: 'number', required: true, order: 2 }),
      new TextboxQuestion({ key: 'universityId', label: 'University ID', type: 'number', required: true, order: 3 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getUniversityQuestions(): Observable<QuestionBase<any>[]> {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'name', label: 'University Name', required: true, order: 1 }),
      new TextboxQuestion({ key: 'establishmentDate', label: 'Establishment Date', type: 'date', required: false, order: 2 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getCourseRealizationQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getCourseAttendanceQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'konacnaOcena', label: 'Final Grade', type: 'number', min: '5', max: '10', order: 1 }),
      new TextboxQuestion({ key: 'courseRealizationId', label: 'Course Realization ID', type: 'number', order: 2 }),
      new TextboxQuestion({ key: 'studentId', label: 'Student ID', type: 'number', order: 3 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getLearningOutcomeQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'description', label: 'Description', type: 'text', order: 1 }),
      new TextboxQuestion({ key: 'subjectId', label: 'Subject ID', type: 'number', order: 2 }),
      new TextboxQuestion({ key: 'educationalGoalIds', label: 'Educational Goal IDs', type: 'text', order: 3 }),
      new TextboxQuestion({ key: 'teachingMaterialIds', label: 'Teaching Material IDs', type: 'text', order: 4 }),
      new TextboxQuestion({ key: 'knowledgeEvaluationIds', label: 'Knowledge Evaluation IDs', type: 'text', order: 5 }),
      new TextboxQuestion({ key: 'teachingSessionIds', label: 'Teaching Session IDs', type: 'text', order: 6 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getSubjectQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'name', label: 'Subject Name', type: 'text', required: true, order: 1 }),
      new TextboxQuestion({ key: 'espb', label: 'ESPB', type: 'number', required: true, min: '0', max: '60', order: 2 }),
      new DropdownQuestion({
        key: 'mandatory',
        label: 'Mandatory',
        options: [
          { id: 1, naziv: 'Yes' },
          { id: 0, naziv: 'No' }
        ],
        required: true,
        order: 3
      }),
      new TextboxQuestion({ key: 'gradingSchemeId', label: 'Grading Scheme ID', type: 'number', required: false, order: 4 }),
      new TextboxQuestion({ key: 'lectureCount', label: 'Lecture Count', type: 'number', order: 5 }),
      new TextboxQuestion({ key: 'labCount', label: 'Lab Count', type: 'number', order: 6 }),
      new TextboxQuestion({ key: 'otherTeachingForms', label: 'Other Teaching Forms', type: 'number', order: 7 }),
      new TextboxQuestion({ key: 'researchWork', label: 'Research Work', type: 'number', order: 8 }),
      new TextboxQuestion({ key: 'otherClasses', label: 'Other Classes', type: 'number', order: 9 }),
      new TextboxQuestion({ key: 'studyYearId', label: 'Study Year ID', type: 'number', required: true, order: 10 }),
      new TextboxQuestion({ key: 'syllabusIds', label: 'Syllabus IDs', type: 'text', order: 11 }),
      new TextboxQuestion({ key: 'subSubjectIds', label: 'Sub Subject IDs', type: 'text', order: 12 }),
      new TextboxQuestion({ key: 'parentSubjectId', label: 'Parent Subject ID', type: 'number', order: 13 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getEducationalGoalQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'description', label: 'Description', type: 'text', order: 1 }),
      new TextboxQuestion({ key: 'learningOutcomeIds', label: 'Learning Outcome IDs', type: 'text', order: 2 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getKnowledgeEvaluationQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'startTime', label: 'Start Time', type: 'datetime-local', order: 1 }),
      new TextboxQuestion({ key: 'endTime', label: 'End Time', type: 'datetime-local', order: 2 }),
      new TextboxQuestion({ key: 'points', label: 'Points', type: 'number', min: '0', order: 3 }),
      new TextboxQuestion({ key: 'evaluationInstrumentId', label: 'Evaluation Instrument ID', type: 'number', order: 4 }),
      new TextboxQuestion({ key: 'evaluationTypeId', label: 'Evaluation Type ID', type: 'number', order: 5 }),
      new TextboxQuestion({ key: 'courseRealizationId', label: 'Course Realization ID', type: 'number', order: 6 }),
      new TextboxQuestion({ key: 'learningOutcomeIds', label: 'Learning Outcome IDs', type: 'text', order: 7 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getTeacherOnCourseQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'numberOfClasses', label: 'Number of Classes', type: 'number', min: '0', order: 1 }),
      new TextboxQuestion({ key: 'teacherId', label: 'Teacher ID', type: 'number', order: 2 }),
      new TextboxQuestion({ key: 'teachingTypeId', label: 'Teaching Type ID', type: 'number', order: 3 }),
      new TextboxQuestion({ key: 'courseRealizationId', label: 'Course Realization ID', type: 'number', order: 4 }),
      new TextboxQuestion({ key: 'notificationIds', label: 'Notification IDs', type: 'text', order: 5 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getEvaluationAttemptQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'points', label: 'Points', type: 'number', order: 1 }),
      new TextboxQuestion({ key: 'note', label: 'Note', type: 'text', order: 2 }),
      new TextboxQuestion({ key: 'evaluationId', label: 'Evaluation ID', type: 'number', order: 3 }),
      new TextboxQuestion({ key: 'studentInYearId', label: 'Student in Year ID', type: 'number', order: 4 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getTeachingSessionQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'startTime', label: 'Start Time', type: 'datetime-local', order: 1 }),
      new TextboxQuestion({ key: 'endTime', label: 'End Time', type: 'datetime-local', order: 2 }),
      new TextboxQuestion({ key: 'courseRealizationId', label: 'Course Realization ID', type: 'number', order: 3 }),
      new TextboxQuestion({ key: 'teachingTypeId', label: 'Teaching Type ID', type: 'number', order: 4 }),
      new TextboxQuestion({ key: 'learningOutcomeIds', label: 'Learning Outcome IDs', type: 'text', order: 5 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getEvaluationInstrumentQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'name', label: 'Name', type: 'text', required: true, order: 1 }),
      new TextboxQuestion({ key: 'fileIds', label: 'File IDs', type: 'text', order: 2 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getTeachingMaterialQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'name', label: 'Name', type: 'text', order: 1 }),
      new TextboxQuestion({ key: 'authors', label: 'Authors', type: 'text', order: 2 }),
      new TextboxQuestion({ key: 'yearOfPublication', label: 'Year of Publication', type: 'date', order: 3 }),
      new TextboxQuestion({ key: 'learningOutcomeId', label: 'Learning Outcome ID', type: 'number', order: 4 }),
      new TextboxQuestion({ key: 'fileIds', label: 'File IDs', type: 'text', order: 5 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
  getGradingSchemeQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'totalPoints', label: 'totalPoints', type: 'text', required: true, order: 1 }),
      new TextboxQuestion({ key: 'threshold', label: 'threshold', type: 'number', order: 2 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
  getGradeBoundaryQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({ key: 'id', type: 'hidden', order: 0 }),
      new TextboxQuestion({ key: 'minPoints', label: 'Minimum Points', type: 'number', required: true, order: 1 }),
      new TextboxQuestion({ key: 'gradeValue', label: 'Grade Value', type: 'number', required: true, order: 2 }),
      new TextboxQuestion({ key: 'gradingSchemeId', label: 'Grading Scheme ID', type: 'number', required: true, order: 4 })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
}