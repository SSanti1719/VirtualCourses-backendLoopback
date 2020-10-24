import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {Course, CourseRelations, Area, Faculty, Section, Enroll} from '../models';
import {MongodbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {AreaRepository} from './area.repository';
import {FacultyRepository} from './faculty.repository';
import {SectionRepository} from './section.repository';
import {EnrollRepository} from './enroll.repository';

export class CourseRepository extends DefaultCrudRepository<
  Course,
  typeof Course.prototype.id,
  CourseRelations
> {

  public readonly area: BelongsToAccessor<Area, typeof Course.prototype.id>;

  public readonly faculty: BelongsToAccessor<Faculty, typeof Course.prototype.id>;

  public readonly sections: HasManyRepositoryFactory<Section, typeof Course.prototype.id>;

  public readonly enrolls: HasManyRepositoryFactory<Enroll, typeof Course.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('AreaRepository') protected areaRepositoryGetter: Getter<AreaRepository>, @repository.getter('FacultyRepository') protected facultyRepositoryGetter: Getter<FacultyRepository>, @repository.getter('SectionRepository') protected sectionRepositoryGetter: Getter<SectionRepository>, @repository.getter('EnrollRepository') protected enrollRepositoryGetter: Getter<EnrollRepository>,
  ) {
    super(Course, dataSource);
    this.enrolls = this.createHasManyRepositoryFactoryFor('enrolls', enrollRepositoryGetter,);
    this.registerInclusionResolver('enrolls', this.enrolls.inclusionResolver);
    this.sections = this.createHasManyRepositoryFactoryFor('sections', sectionRepositoryGetter,);
    this.registerInclusionResolver('sections', this.sections.inclusionResolver);
    this.faculty = this.createBelongsToAccessorFor('faculty', facultyRepositoryGetter,);
    this.registerInclusionResolver('faculty', this.faculty.inclusionResolver);
    this.area = this.createBelongsToAccessorFor('area', areaRepositoryGetter,);
    this.registerInclusionResolver('area', this.area.inclusionResolver);
  }
}
