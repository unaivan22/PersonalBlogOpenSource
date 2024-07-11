import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';
import supabase from '../SupabaseClient';
import { ArrowLeft, Share } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";

export default function Edit() {
  const { noteNoteuuid } = useParams();
  const navigate = useNavigate();
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('note_uuid', noteNoteuuid)
        .single();

      if (error) {
        console.error('Error fetching note:', error.message);
        setIsLoading(false);
        return;
      }

      setNoteTitle(data.title);
      setNoteText(data.note_text);
      setIsLoading(false);
    };

    fetchNote();
  }, [noteNoteuuid]);

  const handleUpdateNote = async () => {
    const currentTimestamp = new Date().toISOString();
  
    const { data, error } = await supabase
      .from('blogs')
      .update({
        title: noteTitle,
        note_text: noteText,
        created_at: currentTimestamp // Update the created_at field
      })
      .eq('note_uuid', noteNoteuuid);
  
    if (error) {
      console.error('Error updating note:', error.message);
      return;
    }
  
    navigate('/writings');
  };  

  const fullToolbarOptions = [
    [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    ['link', 'image', 'video'],
    ['clean']
  ];

  if (isLoading) {
    return <div className="grid h-screen place-items-center text-muted-foreground font-light text-sm">Loading...</div>;
  }

  return (
    <div className='container mx-auto bg-stone-100 h-max min-h-screen rounded-xl p-4 m-4'>
      <Helmet>
        <title>{noteTitle}</title>
      </Helmet>
      <div className='flex mx-auto max-w-2xl items-center justify-between pt-8 pb-4 gap-x-2'>
        <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbLink href="/writings">Writings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
        </Breadcrumb>
    </div>
      <div className='flex mx-auto max-w-2xl items-center justify-between h-[20vh] gap-x-2'>
        <Link to='/writings' className='text-lg font-semibold px-3 py-1 border-[2px] border-black rounded-2xl flex items-center gap-x-2'> <ArrowLeft /> Cancel</Link>
        <Button className='rounded-xl' onClick={handleUpdateNote}> <Share className='w-4 h-4 mr-2' /> Update</Button>
      </div>
      <div className='mx-auto max-w-2xl mb-12 flex flex-col'>
        <Input type="text" placeholder="Title" className='rounded mt-4 border-none text-2xl mb-2 bg-transparent' value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)} />
            <ReactQuill
            theme="snow"
            value={noteText}
            onChange={setNoteText}
            modules={{ toolbar: fullToolbarOptions }}
            placeholder={"Write something awesome..."}
            className='quill-editor rounded-xl border-none min-h-[50vh]'
            rows='12'
            />
        </div>
    </div>
  );
}
