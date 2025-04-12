import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import AuthForm from "@/components/AuthForm";

export default function SignUpPage() {
  return (
    <div className="flex flex-col h-screen items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4">
          <CardTitle className="text-center text-3xl">SignUp</CardTitle>
        </CardHeader>
        <AuthForm type="signUp"></AuthForm>
      </Card>
    </div>
  );
}
