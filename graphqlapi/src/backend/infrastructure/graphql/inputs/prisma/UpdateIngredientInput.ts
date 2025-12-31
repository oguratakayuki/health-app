import { InputType, Field, PartialType } from 'type-graphql';
import { CreateIngredientInput } from './CreateIngredientInput';

@InputType()
export class UpdateIngredientInput extends PartialType(CreateIngredientInput) {}
