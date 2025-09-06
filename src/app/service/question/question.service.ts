import { Injectable } from '@angular/core';
import { DropdownQuestion } from '../../model/questions/question-dropdown';
import { QuestionBase } from '../../model/questions/question-base';
import { TextboxQuestion } from '../../model/questions/question-textbox';
import { Observable, of } from 'rxjs';
@Injectable()
export class QuestionService {
  getLoginQuestions() {
    const questions: QuestionBase<string>[] = [
      // login i register rade normalno
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
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      order: 2,
      validators: ['required', 'minLength:6'],
    }),
    new TextboxQuestion({
      key: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      required: true,
      order: 3,
      validators: ['required', 'minLength:6', 'match:password'], 
    }),
  ].sort((a, b) => a.order - b.order));
}

  
  getTeacherQuestions() {
    const questions: QuestionBase<string>[] = [
      // prikazuje teachere normalno, ali ih ne kreira, valjda zato što nema polje za adresu
      new TextboxQuestion({ key: 'id', type: 'hidden' }),
      new TextboxQuestion({ key: 'name', label: 'Name', required: true }),
      new TextboxQuestion({ key: 'biography', label: 'Biography' }),
      new TextboxQuestion({ key: 'jmbg', label: 'JMBG', required: true }),
      new TextboxQuestion({ key: 'email', label: 'Email', required: true }),
      new TextboxQuestion({ key: 'password', label: 'Password', required: true })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  } getUserQuestions() { 
    const questions: QuestionBase<string>[] = [
      // radi normalno
      new TextboxQuestion({ key: 'id', type: 'hidden' }),
      new TextboxQuestion({ key: 'email', label: 'Email', required: true }),
      new TextboxQuestion({ key: 'password', label: 'Password', required: true })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
  getRegisteredUserQuestions() {
    const questions: QuestionBase<string>[] = [
      // prikazuje registered usere normalno, ali ne može da ih doda
      new TextboxQuestion({ key: 'id', type: 'number' }),

    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
  getStudentQuestions() {
    const questions: QuestionBase<string>[] = [
      // prikazuje normalno ali ne kreira studenta, valjda zato što nema selekciju za adresu?
      new TextboxQuestion({ key: 'id', type: 'hidden' }),
      new TextboxQuestion({ key: 'name', label: 'Name', required: true }),
      new TextboxQuestion({ key: 'jmbg', label: 'JMBG', required: true }),
      new TextboxQuestion({ key: 'email', label: 'Email', required: true }),
      new TextboxQuestion({ key: 'password', label: 'Password', required: true })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  } getAdministratorQuestions() {
    const questions: QuestionBase<string>[] = [
      // ne kreira administratora ali ih prikazuje, šta je access level?
      new TextboxQuestion({ key: 'id', type: 'hidden' }),
      new TextboxQuestion({ key: 'accessLevel', label: 'Access Level', required: true }),
      new TextboxQuestion({ key: 'email', label: 'Email', required: true }),
      new TextboxQuestion({ key: 'password', label: 'Password', required: true })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getRoleQuestions() {
    const questions: QuestionBase<string>[] = [
      // ovaj radi ko podmazan
      new TextboxQuestion({ key: 'id', type: 'hidden' }),
      new TextboxQuestion({ key: 'name', label: 'Role Name', required: true })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getMessageQuestions() {
    const questions: QuestionBase<string>[] = [
      // prikazuje 403 grešku, nije još implementiran na backendu
      // nedostaje Attachments question
      new TextboxQuestion({
        key: 'id',
        type: 'hidden'
      }),
      new TextboxQuestion({
        key: 'dateSent',
        label: 'Date Sent',
        type: 'date',
        required: true
      }),
      new TextboxQuestion({
        key: 'content',
        label: 'Content',
        required: true
      }),
      new DropdownQuestion({
        key: 'sender',
        label: 'Sender',
        required: true,
        options: []
      }),
      new DropdownQuestion({
        key: 'receiver',
        label: 'Receiver',
        required: true,
        options: []
      })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
    getNotificationQuestions() {
      const questions: QuestionBase<string>[] = [
        // izmenio requestMapping na backendu na /api/notification, jos uvek daje 403 gresku, valjda nije implementiran
        // isto nedostaje Attachments question
        new TextboxQuestion({
          key: 'id',
          type: 'hidden'
        }),
        new TextboxQuestion({
          key: 'title',
          label: 'Title',
          required: true
        }),
        new TextboxQuestion({
          key: 'content',
          label: 'Content',
          required: true
        }),
        new TextboxQuestion({
          key: 'timePosted',
          label: 'Time Posted',
          type: 'datetime-local',
          required: true
        }),
        new DropdownQuestion({
          key: 'courseRealization',
          label: 'Course Realization',
          options: []
        }),
        new DropdownQuestion({
          key: 'teacherOnCourse',
          label: 'Teacher on Course',
          options: []
        })
      ];
      return of(questions.sort((a, b) => a.order - b.order));
    }
  
  getAddressQuestions() {
    const questions: QuestionBase<string>[] = [
      // nešto nije u redu sa prikazom adrese
      // i adresa takođe ne može da se kreira jer ne prikazuje one dropdown opcije
      new TextboxQuestion({
        key: 'id',
        type: 'hidden'
      }),
      new TextboxQuestion({
        key: 'address',
        label: 'Street Address',
        required: true
      }),
      new TextboxQuestion({
        key: 'number',
        label: 'Number',
        required: true
      }),
      new TextboxQuestion({
        key: 'city',
        label: 'City',
        required: true
      }),
      new TextboxQuestion({
        key: 'country',
        label: 'Country',
        required: true
      }),
      new DropdownQuestion({
        key: 'student',
        label: 'Student',
        options: []
      }),
      new DropdownQuestion({
        key: 'teacher',
        label: 'Teacher',
        options: []
      }),
      new DropdownQuestion({
        key: 'university',
        label: 'University',
        options: []
      }),
      new DropdownQuestion({
        key: 'faculty',
        label: 'Faculty',
        options: []
      })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
  getTitleQuestions() {
    const questions: QuestionBase<string>[] = [
      // ne radi jer ne prikazuje nastavnike u kreiranju
      // barem ne prikazuje 403 grešku otkad sam izmenio URI na backendu
      new TextboxQuestion({
        key: 'id',
        type: 'hidden'
      }),
      new TextboxQuestion({
        key: 'selectionDate',
        label: 'Selection Date',
        type: 'date'
      }),
      new TextboxQuestion({
        key: 'endDate',
        label: 'End Date',
        type: 'date'
      }),
      new DropdownQuestion({
        key: 'teacher',
        label: 'Teacher',
        options: []
      }),
      new DropdownQuestion({
        key: 'scientificFields',
        label: 'Scientific Fields',
        options: []
      }),
      new DropdownQuestion({
        key: 'titleTypes',
        label: 'Title Types',
        options: []
      })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }
  getTitleTypeQuestions() {
  const questions: QuestionBase<string>[] = [
    // ovaj isto ne radi, jer ne prikazuje ove opcije za related title
    // takodje ne daje 403 gresku
    new TextboxQuestion({
      key: 'id',
      type: 'hidden'
    }),
    new TextboxQuestion({
      key: 'name',
      label: 'Title Name',
      required: true
    }),
    new DropdownQuestion({
      key: 'title',
      label: 'Related Title',
      options: []
    })
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getScientificFieldQuestions() {
  const questions: QuestionBase<string>[] = [
    // isto kao prethodno, ne radi jer ne prikazuje associated title
    // takodje ne prikazuje 403 grešku otkad sam izmenio URI na backendu
    new TextboxQuestion({
      key: 'id',
      type: 'hidden'
    }),
    new TextboxQuestion({
      key: 'name',
      label: 'Scientific Field Name',
      required: true
    }),
    new DropdownQuestion({
      key: 'title',
      label: 'Associated Title',
      options: []
    })
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getUserOnForumQuestions() {
  const questions: QuestionBase<any>[] = [
    // jednostavno ne radi
    // barem ne prikazuje 403 grešku
    new TextboxQuestion({ key: 'id', label: 'ID', required: true }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getTopicQuestions() {
  const questions: QuestionBase<any>[] = [
    // prođe kroz kreiranje topica, ali ne prikazuje, pretpostavljam da ga uopšte ne kreira
    // takodje ne prikazuje 403
    new TextboxQuestion({ key: 'id', label: 'ID', required: true }),
    new TextboxQuestion({ key: 'name', label: 'Topic Name', required: true }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getForumQuestions() {
  const questions: QuestionBase<any>[] = [
    // isto kao prethodno, prođe ali ne prikaže
    // takodje ne prikazuje 403
    new TextboxQuestion({ key: 'id', label: 'ID', required: true }),
    new TextboxQuestion({ key: 'javni', label: 'Is Public', required: true }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getPostQuestions() {
  const questions: QuestionBase<any>[] = [
    // pretpostavljam da ova pitanja za forum ne rade jer nismo još implementirali nikakav forum
    // takodje ne prikazuje 403
    new TextboxQuestion({ key: 'id', label: 'ID', required: true }),
    new TextboxQuestion({ key: 'postingTime', label: 'Posting Time', required: true }),
    new TextboxQuestion({ key: 'content', label: 'Content', required: true }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getFileQuestions() {
  const questions: QuestionBase<any>[] = [
    // prođe kroz kreaciju fajla, ne prikaže u tabeli, valjda isto kao forum i topic
    // takodje ne prikazuje 403
    new TextboxQuestion({ key: 'id', label: 'ID', required: true }),
    new TextboxQuestion({ key: 'description', label: 'Description', required: true }),
    new TextboxQuestion({ key: 'url', label: 'File URL', required: true }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getStudyProgramQuestions() {
  const questions: QuestionBase<any>[] = [
    // više ne prikazuje 403 grešku ali ne radi
    new TextboxQuestion({ key: 'id', label: 'ID', required: true }),
    new TextboxQuestion({ key: 'name', label: 'Program Name', required: true }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getStudyYearQuestions() {
  const questions: QuestionBase<any>[] = [
    // isto kao prethodno
    new TextboxQuestion({ key: 'id', label: 'ID', required: true }),
    new TextboxQuestion({ key: 'enrollmentDate', label: 'Enrollment Date', required: true }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getStudentInYearQuestions() {
  const questions: QuestionBase<any>[] = [
    // ne radi, ne prijavljuje 403 gresku
    new TextboxQuestion({ key: 'id', label: 'ID', required: true }),
    new TextboxQuestion({ key: 'enrollmentDate', label: 'Enrollment Date', required: true }),
    new TextboxQuestion({ key: 'indexNumber', label: 'Index Number', required: true }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getFacultyQuestions() {
  const questions: QuestionBase<any>[] = [
    // baguje prikaz fakulteta, ne znam zašto, prikazuje prvi faks koji sam dodao ali ne prikazuje sledeće koje sam dodao
    // isto kao ovo sledeće pitanje
    new TextboxQuestion({ key: 'id', label: 'ID', required: false }),
    new TextboxQuestion({ key: 'name', label: 'Faculty Name', required: false }),
    new TextboxQuestion({ key: 'dean', label: 'Dean', required: false }),
    new TextboxQuestion({ key: 'university', label: 'University', required: false }),
    new TextboxQuestion({ key: 'addresses', label: 'Addresses', required: false }),
  ];
  
  return of(questions.sort((a, b) => a.order - b.order));
}
getUniversityQuestions() {
  const questions: QuestionBase<any>[] = [
    // ja ne znam šta se ovde dešava, prikazuje prvi univerzitet koji sam napravio u MySQL Workbench-u,
    // ali neće da prikazuje više od tog prvog, čak i kad sam dodao druge univerzitete
    // takođe prođe kreiranje univerziteta, ali ne prikazuje se u tabeli, niti se zapravo napravi u SQL-u
    // znači ovo ne radi, iz nekog razloga, ili sam ja nešto zaribao na mom kompu
    new TextboxQuestion({ key: 'id', label: 'ID', required: false }),
    new TextboxQuestion({ key: 'name', label: 'University Name', required: false }),
    new TextboxQuestion({ key: 'establishmentDate', label: 'Establishment Date', required: false }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getCourseRealizationQuestions() {
  const questions: QuestionBase<any>[] = [
    // ne radi, ali ne prijavljuje 403 forbidden
    new TextboxQuestion({ key: 'id', label: 'ID', required: true }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}

getCourseAttendanceQuestions() {
  const questions: QuestionBase<string>[] = [
    // nece raditi jer ne prikazuje studente, takodje nema 403 forbidden
    new TextboxQuestion({
      key: 'id',
      label: 'ID',
      type: 'hidden',
    }),
    new TextboxQuestion({
      key: 'konacnaOcena',
      label: 'Final Grade',
      type: 'number',
      required: false,
      min: '0',
      max: '10',
    }),
    new DropdownQuestion({
      key: 'courseRealization',
      label: 'Course Realization',
      options: [], // fill with {id, naziv} from data source
      required: false,
    }),
    new DropdownQuestion({
      key: 'student',
      label: 'Student',
      options: [], // fill with {id, naziv} from data source
      required: false,
    }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getLearningOutcomeQuestions() {
  const questions: QuestionBase<string>[] = [
    // nece raditi isto kao ovo prethodno, ali ne prjavljuje 403 gresku
    new TextboxQuestion({
      key: 'id',
      label: 'ID',
      type: 'hidden',
    }),
    new TextboxQuestion({
      key: 'description',
      label: 'Description',
      type: 'text',
      required: false,
    }),
    new DropdownQuestion({
      key: 'subject',
      label: 'Subject',
      options: [], // fill with {id, naziv} from your subjects data
      required: false,
    }),
    new DropdownQuestion({
      key: 'educationalGoals',
      label: 'Educational Goals',
      options: [], // multi-select ideally, but dropdown placeholder here
      required: false,
    }),
    new DropdownQuestion({
      key: 'teachingMaterials',
      label: 'Teaching Materials',
      options: [],
      required: false,
    }),
    new DropdownQuestion({
      key: 'knowledgeEvaluations',
      label: 'Knowledge Evaluations',
      options: [],
      required: false,
    }),
    new DropdownQuestion({
      key: 'teachingSessions',
      label: 'Teaching Sessions',
      options: [],
      required: false,
    }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getSubjectQuestions() {
  const questions: QuestionBase<string>[] = [
    new TextboxQuestion({
      key: 'id',
      label: 'ID',
      type: 'hidden',
    }),
    new TextboxQuestion({
      key: 'name',
      label: 'Subject Name',
      type: 'text',
      required: false,
    }),
    new TextboxQuestion({
      key: 'espb',
      label: 'ESPB',
      type: 'number',
      required: false,
      min: '0',
      max: '60',
    }),
    new DropdownQuestion({
      key: 'mandatory',
      label: 'Mandatory',
      options: [
        { id: 1, naziv: 'Yes' },
        { id: 0, naziv: 'No' },
      ],
      required: false,
    }),
    new TextboxQuestion({
      key: 'lectureCount',
      label: 'Lecture Count',
      type: 'number',
      required: false,
    }),
    new TextboxQuestion({
      key: 'labCount',
      label: 'Lab Count',
      type: 'number',
      required: false,
    }),
    new TextboxQuestion({
      key: 'otherTeachingForms',
      label: 'Other Teaching Forms',
      type: 'number',
      required: false,
    }),
    new TextboxQuestion({
      key: 'researchWork',
      label: 'Research Work',
      type: 'number',
      required: false,
    }),
    new TextboxQuestion({
      key: 'otherClasses',
      label: 'Other Classes',
      type: 'number',
      required: false,
    }),
    new DropdownQuestion({
      key: 'studyYear',
      label: 'Study Year',
      options: [], // fill from StudyYear data
      required: false,
    }),
    new DropdownQuestion({
      key: 'syllabus',
      label: 'Syllabus (Learning Outcomes)',
      options: [], // fill from LearningOutcome data
      required: false,
    }),
    new DropdownQuestion({
      key: 'subSubjects',
      label: 'Sub Subjects',
      options: [], // fill from Subject data
      required: false,
    }),
    new DropdownQuestion({
      key: 'parentSubject',
      label: 'Parent Subject',
      options: [], // fill from Subject data
      required: false,
    }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getEducationalGoalQuestions() {
  const questions: QuestionBase<string>[] = [
    new TextboxQuestion({
      key: 'id',
      label: 'ID',
      type: 'hidden',
    }),
    new TextboxQuestion({
      key: 'description',
      label: 'Description',
      type: 'text',
      required: false,
    }),
    new DropdownQuestion({
      key: 'learningOutcomes',
      label: 'Learning Outcomes',
      options: [], // fill from LearningOutcome data
      required: false,
    }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getKnowledgeEvaluationQuestions() {
  const questions: QuestionBase<string>[] = [
    new TextboxQuestion({
      key: 'id',
      label: 'ID',
      type: 'hidden',
    }),
    new TextboxQuestion({
      key: 'startTime',
      label: 'Start Time',
      type: 'datetime-local',
      required: false,
    }),
    new TextboxQuestion({
      key: 'endTime',
      label: 'End Time',
      type: 'datetime-local',
      required: false,
    }),
    new TextboxQuestion({
      key: 'points',
      label: 'Points',
      type: 'number',
      required: false,
      min: '0',
    }),
    new DropdownQuestion({
      key: 'evaluationInstrument',
      label: 'Evaluation Instrument',
      options: [], // fill from EvaluationInstrument data
      required: false,
    }),
    new DropdownQuestion({
      key: 'evaluationType',
      label: 'Evaluation Type',
      options: [], // fill from EvaluationType data
      required: false,
    }),
    new DropdownQuestion({
      key: 'courseRealization',
      label: 'Course Realization',
      options: [], // fill from CourseRealization data
      required: false,
    }),
    new DropdownQuestion({
      key: 'learningOutcomes',
      label: 'Learning Outcomes',
      options: [], // fill from LearningOutcome data
      required: false,
    }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}
getTeacherOnCourseQuestions() {
  const questions: QuestionBase<string>[] = [
    new TextboxQuestion({
      key: 'id',
      label: 'ID',
      type: 'hidden',
    }),
    new TextboxQuestion({
      key: 'numberOfClasses',
      label: 'Number of Classes',
      type: 'number',
      required: false,
      min: '0',
    }),
    new DropdownQuestion({
      key: 'teacher',
      label: 'Teacher',
      options: [], // fill from Teacher data
      required: false,
    }),
    new DropdownQuestion({
      key: 'teachingType',
      label: 'Teaching Type',
      options: [], // fill from TeachingType data
      required: false,
    }),
    new DropdownQuestion({
      key: 'courseRealization',
      label: 'Course Realization',
      options: [], // fill from CourseRealization data
      required: false,
    }),
    new DropdownQuestion({
      key: 'notifications',
      label: 'Notifications',
      options: [], // fill from Notification data
      required: false,
    }),
  ];
  return of(questions.sort((a, b) => a.order - b.order));
}

  getEvaluationAttemptQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({
        key: "id",
        type: "hidden"
      }),
      new TextboxQuestion({
        key: "points",
        label: "Points",
        type: "number",
        required: false,
        order: 1
      }),
      new TextboxQuestion({
        key: "note",
        label: "Note",
        type: "text",
        required: false,
        order: 2
      }),
      new DropdownQuestion({
        key: "evaluation",
        label: "Evaluation",
        options: [], // Fill dynamically with KnowledgeEvaluation id-name pairs
        required: false,
        order: 3
      }),
      new DropdownQuestion({
        key: "studentInYear",
        label: "Student in Year",
        options: [], // Fill dynamically with StudentInYear id-name pairs
        required: false,
        order: 4
      })
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getTeachingSessionQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({
        key: "id",
        type: "hidden"
      }),
      new TextboxQuestion({
        key: "startTime",
        label: "Start Time",
        type: "datetime-local",
        required: false,
        order: 1
      }),
      new TextboxQuestion({
        key: "endTime",
        label: "End Time",
        type: "datetime-local",
        required: false,
        order: 2
      }),
      new DropdownQuestion({
        key: "courseRealization",
        label: "Course Realization",
        options: [], // Fill dynamically with CourseRealization id-name pairs
        required: false,
        order: 3
      }),
      new DropdownQuestion({
        key: "teachingType",
        label: "Teaching Type",
        options: [], // Fill dynamically with TeachingType id-name pairs
        required: false,
        order: 4
      }),
      // For learningOutcomes (array), you could use a multi-select dropdown or a specialized component.
      // For this example, a dropdown with multi-select enabled or just a placeholder:
      new DropdownQuestion({
        key: "learningOutcomes",
        label: "Learning Outcomes",
        options: [], // Fill dynamically with LearningOutcome id-name pairs
        required: false,
        order: 5
      }),
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getEvaluationTypeQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({
        key: "id",
        type: "hidden"
      }),
      new TextboxQuestion({
        key: "name",
        label: "Name",
        required: false,
        order: 1
      }),
      // evaluations are arrays of KnowledgeEvaluation, usually handled separately or via nested forms.
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getTeachingTypeQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({
        key: "id",
        type: "hidden"
      }),
      new TextboxQuestion({
        key: "name",
        label: "Name",
        required: true,
        order: 1
      }),
      // courses and teachingSessions arrays can be managed separately (complex nested forms or child components)
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getEvaluationInstrumentQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({
        key: "id",
        type: "hidden"
      }),
      new TextboxQuestion({
        key: "name",
        label: "Name",
        required: false,
        order: 1
      }),
      new DropdownQuestion({
        key: "file",
        label: "File",
        options: [], // Fill dynamically with File id-name pairs
        required: false,
        order: 2
      }),
      // evaluations are arrays, handle separately
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

  getTeachingMaterialQuestions() {
    const questions: QuestionBase<any>[] = [
      new TextboxQuestion({
        key: "id",
        type: "hidden"
      }),
      new TextboxQuestion({
        key: "name",
        label: "Name",
        required: false,
        order: 1
      }),
      new TextboxQuestion({
        key: "authors",
        label: "Authors",
        required: false,
        order: 2
      }),
      new TextboxQuestion({
        key: "yearOfPublication",
        label: "Year of Publication",
        type: "date",
        required: false,
        order: 3
      }),
      new DropdownQuestion({
        key: "learningOutcome",
        label: "Learning Outcome",
        options: [], // Fill dynamically with LearningOutcome id-name pairs
        required: false,
        order: 4
      }),
      // files is an array; ideally use multi-file upload or multi-select dropdown, for now omit or extend later
    ];
    return of(questions.sort((a, b) => a.order - b.order));
  }

}







