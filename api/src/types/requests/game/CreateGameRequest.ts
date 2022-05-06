import { GenericRequest } from '@/types/requests/GenericRequest';
import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
/**
 * @swagger
 *
 * components:
 *   requestBodies:
 *     CreateGameRequestBody:
 *       description:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 */
export class CreateGameRequest extends GenericRequest<CreateGameRequest> {
  @IsDefined()
  @IsString()
  @IsEmail()
  public email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  public password: string;
}
