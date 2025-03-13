import { AsyncModelFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
/* Schemas */
import { FeatureDocument, featureSchema } from './feature.schema';
import { ProjectDocument, ProjectModel } from './project.schema';
export const featureSchemaFactory: AsyncModelFactory = {
  name: 'Feature',
  imports: [],
  useFactory: (projectModel: Model<ProjectModel>) => {
    const schema = featureSchema;
    schema.post('save', (doc: FeatureDocument) => {
      console.log('%s has been saved', doc._id);
    });
    schema.pre('validate', function (next) {
      console.log('validate', this);
      next();
    });
    schema.pre('save', function (next) {
      console.log('save', this);
      next();
    });
    schema.post('findOneAndDelete', async (doc: FeatureDocument) => {
      console.log(`${doc._id} has been removed`);
      const projects: ProjectDocument[] = await projectModel.find({
        features: { $in: [doc._id] },
      });
      console.log('projects: ', projects);
      projects.forEach(async (project: ProjectDocument) => {
        console.log('updating project: ', project);
        const projectUpdated: ProjectDocument =
          await projectModel.findByIdAndUpdate(
            project._id,
            { $pull: { features: doc._id } },
            { new: true },
          );
        console.log('project updated: ', projectUpdated);
      });
    });
    return schema;
  },
  inject: [],
};
