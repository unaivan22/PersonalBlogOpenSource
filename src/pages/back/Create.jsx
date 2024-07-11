import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft, BadgeCheck, Ban, CheckCircle2, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import "quill/dist/quill.core.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import supabase from '../SupabaseClient';
import { v4 as uuidv4 } from 'uuid';
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function Create() {
  const [session, setSession] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [timelineNotes, setTimelineNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const { width, height } = useWindowSize()
  const [isConfetti, setIsConfetti] = useState(false);

  const fetchTimelineNotes = async () => {
    try {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching blog:', error.message);
          return;
        }

        setTimelineNotes(data);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const initializeTimelineNotes = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        fetchTimelineNotes();
      }
    } catch (error) {
      console.error('Error fetching session:', error.message);
    }
  };

  useEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      setSession(updatedSession);
      if (updatedSession && updatedSession.user) {
        fetchTimelineNotes();
      }
    });

    initializeTimelineNotes();

    return () => authListener.data.subscription.unsubscribe();
  }, []);

  const handleNoteTextChange = (value) => {
    setNewNoteText(value);
  };

  const handleNoteTitleChange = (e) => {
    setNewNoteTitle(e.target.value);
  };

  const handleCreateNote = async () => {
    try {
      const noteUuid = uuidv4();
      const { data, error } = await supabase
        .from('blogs')
        .upsert([
          {
            user_id: session?.user?.id,
            note_text: newNoteText,
            note_uuid: noteUuid,
            title: newNoteTitle,
          },
        ]);

      if (error) {
        console.error('Error creating post:', error.message);
        return;
      }

      fetchTimelineNotes();
      setOpen(true);
      setIsConfetti(true);
    } catch (error) {
      console.error('Error:', error.message);
    }
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

  if (!session) {
    return (
      <div className='grid h-[100svh] place-items-center'>
        <div className='max-w-[350px] relative items-center justify-center flex'>
          <div className='border border-zinc-100 rounded-full p-6'>
            <div className='border border-zinc-200 rounded-full p-6'>
              <div className='border border-zinc-200 rounded-full p-6'>
                <div className='border border-zinc-200 rounded-full p-6'>
                  {/* <Ban className='w-16 h-16' /> */}
                  <h1 className='pixel-typeface text-[3rem] font-bold text-center'>404</h1>
                </div>
              </div>
            </div>
          </div>
          <div className='absolute bottom-[25%] flex flex-col items-center justify-center'>
            <p className='font-semibold text-lg pixel-typeface'>Forbidden!</p>
            <p className='text-xs font-light text-muted-foreground pixel-typeface'>To access this page, you must be an author.</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='container mx-auto bg-stone-100 h-max min-h-screen rounded-xl p-4 m-4'>
        <Helmet>
          <title>Create post</title>
        </Helmet>
        {isConfetti  && ( 
        <Confetti
          width={width}
          height={height}
        />        
        )}
        <div className='flex mx-auto max-w-2xl items-center justify-between h-[20vh] gap-x-2'>
          <Link to='/writings' className='text-lg font-semibold px-3 py-1 border-[2px] border-black rounded-2xl flex items-center gap-x-2'> <ArrowLeft /> Back</Link>
          <Button className='rounded-xl' onClick={handleCreateNote}> <Share className='w-4 h-4 mr-2' /> Publish</Button>
        </div>
        <div className='mx-auto max-w-2xl mb-12 flex flex-col'>
          <Input type="text" placeholder="Title" className='rounded mt-4 border-none text-2xl mb-2 bg-transparent' value={newNoteTitle} onChange={handleNoteTitleChange} />
          <ReactQuill
            theme="snow"
            value={newNoteText}
            onChange={handleNoteTextChange}
            modules={{ toolbar: fullToolbarOptions }}
            placeholder={"Write something awesome..."}
            className='quill-editor rounded-xl border-none min-h-[50vh]'
            rows='12'
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[380px] rounded-lg dialogWelcome syncDialog" onInteractOutside={(e) => {
            e.preventDefault();
            }}>
            <div className="flex items-center space-x-2">
                <div className="flex flex-col items-center justify-center my-8 w-full">
                  <BadgeCheck className='w-32 h-32' />
                  <div className='flex flex-col items-center justify-center mt-6'>
                      <p className='text-muted-foreground'>Success!</p>
                      <p className='text-muted-foreground text-center text-xs'>Posts are saved and published.</p>
                  </div>
                </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <div className='w-full flex items-center justify-center'>
                <Link to='/lists'>
                  <Button type="button" className='w-full'>
                      Done
                  </Button>
                </Link>
                </div>
              </DialogClose>
            </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    );
  }
}
