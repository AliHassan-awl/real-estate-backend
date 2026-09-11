import jwt from'jsonwebtoken';import slugify from'slugify';import{config,prisma}from'./config.js';
export class AppError extends Error{constructor(message,status=500,details){super(message);this.status=status;this.details=details}}
export const ok=(res,data,message='Success',status=200)=>res.status(status).json({success:true,message,data});
export const asyncHandler=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
export const sign=user=>jwt.sign({sub:user.id,role:user.role},config.jwtSecret,{expiresIn:config.jwtExpires});
export const uniqueSlug=async(model,title,exclude)=>{const base=slugify(title,{lower:true,strict:true})||'item';let slug=base,n=1;while(await prisma[model].findFirst({where:{slug,...(exclude?{id:{not:exclude}}:{})},select:{id:true}}))slug=`${base}-${n++}`;return slug};
export const serialize=x=>JSON.parse(JSON.stringify(x,(_,v)=>typeof v==='bigint'?Number(v):v?.constructor?.name==='Decimal'?Number(v):v));
