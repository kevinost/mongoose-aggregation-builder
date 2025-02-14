import { BridgeModelI } from './interface';
import { convertDBSchemasToDBI } from './types';
import { Pretify, Plurial } from '../utils';
import { Model as MongooseModel, model as createMongooseModel, Schema as MongooseSchema } from 'mongoose';
import { Aggregate } from './aggregate';
import { Schema as SchemaClass } from '../schema';

export class BridgeModel<
    SchemasI extends Record<string, any>,
    ModelName extends keyof SchemasI & string,
    DBI = Pretify<convertDBSchemasToDBI<SchemasI>>,
    Schema extends SchemaClass<any, any> = SchemasI[ModelName],
    ModelI = DBI[Plurial<Lowercase<ModelName>> & keyof DBI],
> implements BridgeModelI<SchemasI, ModelName>
{
    public mongooseModel: MongooseModel<ModelI>;

    public modelInterface!: ModelI;
    public DBI!: DBI;

    constructor(
        schema: Schema,
        public modelName: ModelName,
    ) {
        const mongooseSchema = new MongooseSchema(schema.schemaDef, schema.config || { timestamps: false });
        this.mongooseModel = createMongooseModel<ModelI>(modelName, mongooseSchema);
    }

    public aggregate = () => new Aggregate<SchemasI, ModelName, DBI, ModelI>(this.mongooseModel);

    create: BridgeModelI<SchemasI, ModelName>['create'] = async (data) => {
        try {
            return ((await this.mongooseModel.create([data])) as any)[0].toJSON();
        } catch (err: any) {
            if (err.code === 11000)
                return {
                    error: { status: 409, name: `${this.modelName} already exists`, data: err.keyValue },
                };
            // Should we handle some other errors here ?
            else throw err;
        }
    };

    find: BridgeModelI<SchemasI, ModelName>['find'] = async (filter, projection, options) => {
        try {
            return await this.mongooseModel.find(filter as any, projection || undefined, {
                lean: true,
                ...(options || {}),
            });
        } catch (err: any) {
            // Should we handle some errors here ?
            throw err;
        }
    };

    findById: BridgeModelI<SchemasI, ModelName>['findById'] = async (filter, projection, options) => {
        try {
            const res: any = await this.mongooseModel.findById(filter, projection || undefined, {
                lean: true,
                ...(options || {}),
            });
            if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
            return res;
        } catch (err) {
            // Should we handle some errors here ?
            throw err;
        }
    };

    findOne: BridgeModelI<SchemasI, ModelName>['findOne'] = async (filter, projection, options) => {
        try {
            const res: any = await this.mongooseModel.findOne(filter as any, projection || undefined, {
                lean: true,
                ...(options || {}),
            });
            if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
            return res;
        } catch (err) {
            // Should we handle some errors here ?
            throw err;
        }
    };

    findOneAndUpdate: BridgeModelI<SchemasI, ModelName>['findOneAndUpdate'] = async (filter, updateQuery, options) => {
        try {
            const res: any = await (this.mongooseModel as any).findOneAndUpdate(filter as any, updateQuery, {
                lean: true,
                ...options,
            });
            if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
            return res;
        } catch (err) {
            // Should we handle some errors here ?
            throw err;
        }
    };

    findByIdAndUpdate: BridgeModelI<SchemasI, ModelName>['findByIdAndUpdate'] = async (
        filter,
        updateQuery,
        options,
    ) => {
        try {
            const res: any = await (this.mongooseModel as any).findByIdAndUpdate(filter, updateQuery, {
                lean: true,
                ...options,
            });
            if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
            return res;
        } catch (err) {
            // Should we handle some errors here ?
            throw err;
        }
    };

    findOneAndDelete: BridgeModelI<SchemasI, ModelName>['findOneAndDelete'] = async (filter, options) => {
        try {
            const res: any = await this.mongooseModel.findOneAndDelete(filter as any, options);
            if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
            return res;
        } catch (err) {
            // Should we handle some errors here ?
            throw err;
        }
    };

    findByIdAndDelete: BridgeModelI<SchemasI, ModelName>['findByIdAndDelete'] = async (filter, options) => {
        try {
            const res: any = await this.mongooseModel.findByIdAndDelete(filter, options);
            if (!res) return { error: { status: 404, name: `${this.modelName} not found` } };
            return res;
        } catch (err) {
            // Should we handle some errors here ?
            throw err;
        }
    };

    exists: BridgeModelI<SchemasI, ModelName>['exists'] = async (filter) => {
        try {
            return (await this.mongooseModel.exists(filter as any)) !== null;
        } catch (err) {
            // Should we handle some errors here ?
            throw err;
        }
    };
}

export * from './types';
