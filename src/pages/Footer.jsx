import { Github, Mail, Twitter } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className='flex items-center justify-between'>
        <p className='text-muted-foreground font-light text-sm'>2024</p>
        <div className='flex gap-x-2 items-center'>
          <Link to='https://twitter.com/' target='_blank'><Twitter className='w-4 h-4 opacity-50 hover:opacity-100' /></Link>
          <Link to='https://github.com/' target='_blank'><Github className='w-4 h-4 opacity-50 hover:opacity-100' /></Link>
          <Link to='mailto:mail@gmail.com'><Mail className='w-4 h-4 opacity-50 hover:opacity-100' /></Link>
          <Link to='/' target='_blank' className='underline font-light text-sm'>Dinivan Nendra</Link>
        </div>
    </div>
  )
}
