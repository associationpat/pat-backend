import { IsNotEmpty } from 'class-validator';

export class ContactInfoDto {
  @IsNotEmpty()
  nom: string;
  @IsNotEmpty()
  prenom: string;
  @IsNotEmpty()
  telephone: string;
  @IsNotEmpty()
  sujet: string;
  @IsNotEmpty()
  description: string;
}
