interface InputFieldProps{
    label:string;
    type?: string;
    value: string;
    onChange: (val:string)=>void ;
}

export function InputField({label,type='text',value,onChange}:InputFieldProps){
    return <div className='p-0'>
        <input className='border border-blue-800 rounded-[0.5vw]'type={type} value={value} placeholder={label} onChange={(e)=> onChange(e.target.value)}/>
        
    </div>
}
