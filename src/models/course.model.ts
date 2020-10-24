import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Area} from './area.model';
import {Faculty} from './faculty.model';
import {Section} from './section.model';
import {Enroll} from './enroll.model';

@model()
export class Course extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
  })
  professor: string;

  @property({
    type: 'number',
    default: 0,
  })
  rate?: number;

  @property({
    type: 'number',
    default: 1,
  })
  duration?: number;

  @property({
    type: 'string',
    required: true,
  })
  image: string;




  @belongsTo(() => Area)
  areaId: string;

  @belongsTo(() => Faculty)
  facultyId: string;

  @hasMany(() => Section)
  sections: Section[];

  @hasMany(() => Enroll)
  enrolls: Enroll[];

  constructor(data?: Partial<Course>) {
    super(data);
  }
}

export interface CourseRelations {
  // describe navigational properties here
}

export type CourseWithRelations = Course & CourseRelations;
