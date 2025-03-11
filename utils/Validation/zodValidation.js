const {z }=require("zod");

const datavalidation=async()=>{

    const userSchema = z.object({
        username: z.string().min(3),
        email: z.string().email(),
        /* age: z.number().positive().default(18), */
        age: z.string().transform(Number),
        password:z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)"),
        address:z.object({
            street:z.string(),
            city:z.string(),
            zip:z.number().positive().optional(),
        }),
        hobbies:z.array(z.string()),
        role:z.enum(["admin","student","teacher"])
      });

      const userData={ 
        username:"john",
        email: "john@example.com",
       age: "25",
       password:"John@0358",
       address:{
        street:"jarnail-enclave",
        city:"zirakpur",
        zip:3545
       },
       hobbies:["cooking","68767","playing"],
       role:"student"
       
     }
      
   const {data,error} = userSchema.safeParse(userData); 
   if(data)console.log("data=>",data);
   else console.log("error=>",error);


}


datavalidation();