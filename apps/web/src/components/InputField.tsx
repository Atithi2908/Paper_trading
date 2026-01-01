interface InputFieldProps{
    label:string;
    type?: string;
    value: string;
    onChange: (val:string)=>void ;
}

export function InputField({label,type='text',value,onChange}:InputFieldProps){
    return <div className='p-0'>
        <input className='w-full border border-blue-800 rounded-lg px-3 py-2 text-sm sm:text-base' type={type} value={value} placeholder={label} onChange={(e)=> onChange(e.target.value)}/>
        
    </div>
}
