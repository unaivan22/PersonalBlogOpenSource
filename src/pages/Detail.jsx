import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import supabase from './SupabaseClient';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';

const Detail = () => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { noteNoteuuid } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('note_uuid', noteNoteuuid)
          .single();

        if (error) {
          console.error('Error fetching blog:', error.message);
          return;
        }

        setBlog(data);
        setNoteTitle(data.title);
      } catch (error) {
        console.error('Error:', error.message);
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    };

    fetchData();
  }, [noteNoteuuid]);

  const HtmlRenderer = ({ html }) => {
    const parsedHtml = parse(html, {
      replace: (domNode) => {
        if (domNode.type === 'text') {
          // Remove leading and trailing whitespaces
          return domNode.data.trim();
        }
      },
    });

    return <>{parsedHtml}</>;
  };

  const removeHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const plainText = doc.body.textContent || "";
    return plainText.trim().replace(/\n/g, " ");
  };

  const formatCreatedAt = (createdAt) => {
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(createdAt).toLocaleString('en-US', options);
  };

  console.log('detail loaded');

  if (isLoading) {
    return <div className='grid h-screen place-items-center text-muted-foreground font-light text-sm'>Loading...</div>; // Display a loading indicator while fetching data
  }

  if (!blog) {
    return <div className='grid h-screen place-items-center text-muted-foreground text-3xl pixel-typeface'>404 - Not found</div>; // Handle case where blog is not found
  }

  return (
    <div className='container mx-auto bg-stone-100 h-max min-h-screen rounded-xl p-4 m-4'>
      <Helmet>
        <title>{noteTitle}</title>
      </Helmet>
      <div className='flex mx-auto max-w-lg items-center justify-between h-[20vh] gap-x-2'>
        <Link onClick={() => navigate(-1)} className='text-lg font-semibold px-3 py-1 border-[2px] border-black rounded-2xl flex items-center gap-x-2'>
          <ArrowLeft /> Back
        </Link>
         <h1 className='text-xs font-light text-muted-foreground '>{formatCreatedAt(blog.created_at)}</h1>
      </div>
      <div className='mx-auto max-w-lg mb-12 gap-y-4 flex flex-col'>
        <h1 className='font-semibold text-4xl'>{blog.title}</h1>
        <p className='text-sm'><HtmlRenderer html={blog.note_text} /></p>
      </div>
    </div>
  );
}

export default Detail;
