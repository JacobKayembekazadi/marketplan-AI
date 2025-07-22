
"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Clipboard, Check } from 'lucide-react';
import { generateMarketingCopy, type GenerateMarketingCopyInput, type GenerateMarketingCopyOutput } from '@/ai/flows/generate-marketing-copy';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const GenerateMarketingCopyInputSchema = z.object({
  productName: z.string().min(1, 'Product name is required.'),
  productDescription: z.string().min(10, 'Description must be at least 10 characters.'),
  targetAudience: z.string().min(1, 'Target audience is required.'),
});


type FormData = z.infer<typeof GenerateMarketingCopyInputSchema>;

const CopyBlock = ({ title, content }: { title: string; content: string | string[] }) => {
    const [copied, setCopied] = useState(false);
    const textToCopy = Array.isArray(content) ? content.join('\n') : content;

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-4 bg-background rounded-md border relative group">
            <h4 className="font-semibold text-foreground/90 mb-2">{title}</h4>
            {Array.isArray(content) ? (
                 <ul className="list-disc pl-5 space-y-1 text-foreground/80">
                    {content.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            ) : (
                <p className="text-foreground/80 whitespace-pre-wrap">{content}</p>
            )}
            <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleCopy}
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
            </Button>
        </div>
    );
};


export default function MarketingCopyGenerator() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedCopy, setGeneratedCopy] = useState<GenerateMarketingCopyOutput | null>(null);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(GenerateMarketingCopyInputSchema),
        defaultValues: {
            productName: '',
            productDescription: '',
            targetAudience: '',
        },
    });

    const onSubmit = async (data: GenerateMarketingCopyInput) => {
        setLoading(true);
        setError('');
        setGeneratedCopy(null);
        try {
            const result = await generateMarketingCopy(data);
            setGeneratedCopy(result);
        } catch (err) {
            console.error("Copy generation error:", err);
            setError("Sorry, I couldn't generate copy at this time. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/20">
            <header className="bg-background border-b">
                <div className="container mx-auto py-4 px-4 md:px-6">
                    <h1 className="text-3xl font-bold font-headline text-primary">AI Marketing Copilot</h1>
                    <p className="text-muted-foreground mt-1">Generate high-converting marketing copy in seconds.</p>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Describe Your Product</CardTitle>
                            <CardDescription>Tell the AI what you're selling.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-1">
                                    <label htmlFor="productName">Product/Service Name</label>
                                    <Controller
                                        name="productName"
                                        control={control}
                                        render={({ field }) => <Input id="productName" placeholder="e.g., Artisan Sourdough Bread" {...field} />}
                                    />
                                    {errors.productName && <p className="text-destructive text-xs">{errors.productName.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="productDescription">Product/Service Description</label>
                                    <Controller
                                        name="productDescription"
                                        control={control}
                                        render={({ field }) => <Textarea id="productDescription" placeholder="e.g., Handcrafted, organic sourdough bread made with a 100-year-old starter. Naturally leavened, healthy, and delicious." {...field} />}
                                    />
                                    {errors.productDescription && <p className="text-destructive text-xs">{errors.productDescription.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="targetAudience">Target Audience</label>
                                    <Controller
                                        name="targetAudience"
                                        control={control}
                                        render={({ field }) => <Input id="targetAudience" placeholder="e.g., Health-conscious families, foodies" {...field} />}
                                    />
                                    {errors.targetAudience && <p className="text-destructive text-xs">{errors.targetAudience.message}</p>}
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? (
                                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</>
                                    ) : (
                                        <><Wand2 className="w-5 h-5 mr-2" /> Generate Copy</>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    {loading && (
                        <div className="space-y-4">
                           <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 mr-3 animate-spin text-primary" />
                                        <span className="text-muted-foreground">Generating amazing copy...</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    {error && <p className="text-destructive text-center">{error}</p>}
                    {generatedCopy && (
                         <div className="space-y-6">
                           <Accordion type="multiple" defaultValue={['fb', 'google', 'landing', 'email']} className="w-full space-y-4">
                               <AccordionItem value="fb" className="border rounded-lg bg-background">
                                   <AccordionTrigger className="px-6 py-4 font-headline text-lg">Facebook Ad</AccordionTrigger>
                                   <AccordionContent className="px-6 pb-6 space-y-4">
                                        <CopyBlock title="Headline" content={generatedCopy.facebookAd.headline} />
                                        <CopyBlock title="Body Text" content={generatedCopy.facebookAd.body} />
                                   </AccordionContent>
                               </AccordionItem>

                                <AccordionItem value="google" className="border rounded-lg bg-background">
                                   <AccordionTrigger className="px-6 py-4 font-headline text-lg">Google Ads</AccordionTrigger>
                                   <AccordionContent className="px-6 pb-6 space-y-4">
                                        <CopyBlock title="Headlines" content={generatedCopy.googleAds.headlines} />
                                        <CopyBlock title="Descriptions" content={generatedCopy.googleAds.descriptions} />
                                   </AccordionContent>
                               </AccordionItem>

                               <AccordionItem value="landing" className="border rounded-lg bg-background">
                                   <AccordionTrigger className="px-6 py-4 font-headline text-lg">Landing Page</AccordionTrigger>
                                   <AccordionContent className="px-6 pb-6 space-y-4">
                                        <CopyBlock title="Hero Title" content={generatedCopy.landingPage.heroTitle} />
                                        <CopyBlock title="Hero Subtitle" content={generatedCopy.landingPage.heroSubtitle} />
                                   </AccordionContent>
                               </AccordionItem>

                               <AccordionItem value="email" className="border rounded-lg bg-background">
                                   <AccordionTrigger className="px-6 py-4 font-headline text-lg">Email</AccordionTrigger>
                                   <AccordionContent className="px-6 pb-6 space-y-4">
                                        <CopyBlock title="Subject Line" content={generatedCopy.email.subject} />
                                        <CopyBlock title="Email Body" content={generatedCopy.email.body} />
                                   </AccordionContent>
                               </AccordionItem>
                           </Accordion>
                        </div>
                    )}
                     {!loading && !generatedCopy && (
                        <Card className="h-full flex items-center justify-center bg-background/50 border-dashed">
                             <div className="text-center p-8">
                                <Wand2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-medium text-muted-foreground">Your generated copy will appear here</h3>
                                <p className="mt-1 text-sm text-muted-foreground/80">
                                    Fill out the form to get started.
                                 </p>
                             </div>
                         </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
