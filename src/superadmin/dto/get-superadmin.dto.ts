export class GetSuperadminDto {
  id!: number;
  name!: string;
  email!: string;
  phone_number!: string;
  birth_date!: Date;
  gender!: string;
  photo?: string;
  photo_decode?: string;
}
