type QuestionnairePageHeaderProps = {
  title: string;
  description: string;
};

export function QuestionnairePageHeader({ title, description }: QuestionnairePageHeaderProps) {
  return (
    <div>
      <h1 className="font-playfair text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
