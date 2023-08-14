import { IsNumberString, IsOptional, IsString } from "class-validator";

export default class ProductoPetroliferoDto {
  @IsString()
  ["C.P."]!: string;

  @IsString()
  ["Dirección"]!: string;

  @IsString()
    Municipio!: string;

  @IsString()
  ["Rótulo"]!: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Biodiesel"]?: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Bioetanol"]?: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Gasoleo A"]?: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Gasoleo B"]?: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Gasoleo C"]?: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Gasoleo Premium"]?: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Gasolina 95 E10"]?: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Gasolina 95 E5"]?: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Gasolina 95 E5 Premium"]?: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Gasolina 98 E10"]?: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Gasolina 98 E5"]?: string;

  @IsOptional()
  @IsString()
  @IsNumberString()
  ["Precio Hidrogeno"]?: string;
}
