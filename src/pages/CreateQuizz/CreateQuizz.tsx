import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { usePost } from '@/custom/api';

const FormSchema = z.object({
  artist: z
    .string({
      required_error: 'Please select an artist to display.',
    })
    .min(1, { message: 'Please select an artist to display.' }),
});

const ARTISTS = [
  'Eminem',
  'Drake',
  'Kanye West',
  'Michael Jackson',
  'Adele',
  'Ed Sheeran',
  'Justin Bieber',
  'Taylor Swift',
  'Rihanna',
  'Lady Gaga',
  'Bruno Mars',
];

export function CreateQuizz() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [artist, setArtist] = useState('');

  const {
    mutate,
    data,
    isSuccess: postSuccess,
    isError: postError,
    error,
  } = usePost(
    `start/${artist}`,
  );

  useEffect(() => {
    if (postSuccess) {
      toast({
        title: 'You get the following values:',
        description: (
          <pre className="mt-2 w-fit rounded-md bg-slate-950 p-4">
            <code className="text-white w-full">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
      console.log(data);
      // navigate(`/dashboard`);
    } else if (postError) {
      console.error(error);
    }
  }, [postSuccess, postError]);


  function onSubmit(data: z.infer<typeof FormSchema>) {
    setArtist(data.artist);
    mutate({});
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <div
      className={`p-10 max-w-xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 backdrop-blur-lg text-primary`}
    >
      <h1 className="text-4xl font-bold mb-10">Create your quizz</h1>
      <div className="mb-8 w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>It's time to select an artist</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select one" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Artists</SelectLabel>
                        {ARTISTS.sort().map((artist, id) => (
                          <SelectItem key={id} value={artist}>
                            {artist}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
