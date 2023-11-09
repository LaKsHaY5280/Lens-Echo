import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutation";

const SignupForm = () => {
  const { toast } = useToast();
  // const isLoading = false;

  const { mutateAsync: createUserAccount, isLoading: isCreatingUser } =
    useCreateUserAccount();

  const { mutateAsync: signInAccount, isLoading: isSignedIn } =
    useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);

    if (!newUser)
      return toast({
        title: "Sign up failed. please try again!",
      });

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session)
      return toast({
        title: "Sign up failed. please try again!",
      });
  }
  return (
    <Form {...form}>
      <div className=" sm:w-420 flex-center flex-col ">
        <div className=" flex justify-center items-center text-3xl font-semibold">
          <img src="/assets/images/logo.svg" alt="logo" />
          <span className="">Lens Echo</span>
        </div>
        <h2 className=" h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className=" text-light-3 small-medium md:base-regular mt-2">
          To use Lens Echo please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className=" shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className=" shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className=" shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className=" shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className=" shad-button_primary">
            {isCreatingUser ? (
              <div className=" flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              <div>Sign Up</div>
            )}
          </Button>
          <p className=" text-small-regular text-light-2 text-center mt-2">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className=" text-primary-500 text-small-semibold ml-1"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;