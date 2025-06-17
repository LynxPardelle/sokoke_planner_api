import { IsOptional, IsString } from 'class-validator';
import { TColor } from '../types/color.type';
export class colorDTO implements TColor {
  @IsOptional()
  @IsString()
  public bgColor: string;
  @IsOptional()
  @IsString()
  public textColor: string;
  @IsOptional()
  @IsString()
  public linkColor: string;
  @IsOptional()
  @IsString()
  public secondaryBgColor: string;
  @IsOptional()
  @IsString()
  public secondaryTextColor: string;
  @IsOptional()
  @IsString()
  public secondaryLinkColor: string;
  @IsOptional()
  @IsString()
  public accentColor: string;
  constructor(color: any) {
    this.bgColor = color.bgColor || '#fff';
    this.textColor = color.textColor || '#000';
    this.linkColor = color.linkColor || '#00a';
    this.secondaryBgColor = color.secondaryBgColor || '#555';
    this.secondaryTextColor = color.secondaryTextColor || '#fff';
    this.secondaryLinkColor = color.secondaryLinkColor || '#0a0';
    this.accentColor = color.accentColor || '#a00';
  }
}
