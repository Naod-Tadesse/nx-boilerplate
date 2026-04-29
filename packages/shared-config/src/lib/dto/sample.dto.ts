import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiPropertyOptional({ example: 'Addis Ababa' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ example: 'Addis Ababa' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Bole' })
  @IsOptional()
  @IsString()
  subcity?: string;

  @ApiPropertyOptional({ example: '03' })
  @IsOptional()
  @IsString()
  kebele?: string;

  @ApiPropertyOptional({ example: '123' })
  @IsOptional()
  @IsString()
  houseNumber?: string;

  @ApiPropertyOptional({ example: '1000' })
  @IsOptional()
  @IsString()
  pobox?: string;

  @ApiPropertyOptional({ example: 'Near Bole Medhanialem' })
  @IsOptional()
  @IsString()
  detail?: string;
}
