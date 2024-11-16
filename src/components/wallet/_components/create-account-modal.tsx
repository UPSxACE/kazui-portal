"use client";
import logo from "@/../public/kazui-coin.svg";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/_sui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/_sui/form";
import Button from "@/components/ui/button";
import Image from "@/components/ui/image";
import Input from "@/components/ui/input";
import useToggle from "@/hooks/use-toggle";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import {
  Dispatch,
  HTMLAttributes,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import { useForm } from "react-hook-form";
import { BsArrowLeft } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { twJoin } from "tailwind-merge";
import { z } from "zod";
import { useAppState } from "../app-state";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  nickname: z.string().min(2).max(50),
  picture: z.string().min(2).max(50),
});

// type Props = ComponentProps<typeof motion.div>;
type Props = HTMLAttributes<HTMLDivElement>;

export default function CeateAccountModal(props: Props) {
  const [step, setStep] = useState(0);
  const [submiting, setSubmiting] = useState(false);
  const {
    credentials: { setAddress, refetchProfile },
    wallet: { refetchKazui },
  } = useAppState();
  const [_address, setAddress_] = useState("");

  const { value, toggle } = useToggle(1);
  const visible = value === 1;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      nickname: "",
      picture: "/profile-picture/default-1.svg",
    },
  });

  const wrap =
    (callback: () => void, verify?: "username" | "nickname" | "picture") =>
    async () => {
      if (verify) {
        await form.trigger(verify);
        if (form.getFieldState(verify).invalid) return;
      }
      toggle();
      setTimeout(callback, 300);
    };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmiting(true);
    await api.post("/user/create-profile", values).then(({ data }) => {
      setSubmiting(false);
      wrap(() => {
        setAddress_(z.string().parse(data));
        setStep(4);
      })();
    });
  }

  function getStep() {
    switch (step) {
      case 0:
        return (
          <Step0
            key={"0"}
            invisible={!visible}
            onClick={wrap(() => setStep(1))}
            form={form}
          />
        );
      case 1:
        return (
          <Step1
            key={"0"}
            invisible={!visible}
            previous={wrap(() => setStep(0))}
            next={wrap(() => setStep(2), "username")}
            form={form}
          />
        );
      case 2:
        return (
          <Step2
            key={"0"}
            invisible={!visible}
            previous={wrap(() => setStep(1))}
            next={wrap(() => setStep(3), "nickname")}
            form={form}
          />
        );
      case 3:
        return (
          <Step3
            key={"0"}
            invisible={!visible}
            previous={wrap(() => setStep(2))}
            next={() => {}}
            form={form}
            submiting={submiting}
          />
        );
      case 4:
        return (
          <Step4
            key={"0"}
            invisible={!visible}
            onClick={() => {
              setAddress(_address);
              refetchProfile();
              refetchKazui();
            }}
            form={form}
          />
        );
    }
  }

  return (
    <DialogContent
      className="bg-transparent shadow-none p-0 max-w-[32rem]"
      aria-describedby={undefined}
    >
      <Flipper
        flipKey={step}
        onComplete={() => {
          toggle();
        }}
      >
        <Flipped flipId={"wrapper"}>
          <div className="bg-background shadow-lg  rounded-sm sm:rounded-lg px-0 py-0">
            <DialogTitle wrapperClassName="hidden" />
            <Form {...form}>
              <DialogDescription asChild>
                <form id="new-account" onSubmit={form.handleSubmit(onSubmit)}>
                  {getStep()}
                </form>
              </DialogDescription>
            </Form>
          </div>
        </Flipped>
      </Flipper>
    </DialogContent>
  );
}

type StepProps = {
  invisible: boolean;
  previous: MouseEventHandler<HTMLButtonElement>;
  next: MouseEventHandler<HTMLButtonElement>;
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
};

type EdgeStepProps = {
  invisible: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
};

function Step0({ invisible, onClick }: EdgeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={twJoin(
        "flex flex-col items-center transition-all duration-200 py-11 px-10",
        invisible && "!opacity-0 duration-300"
      )}
    >
      <div
        className="relative h-24 w-full object-contain"
        // style={{ aspectRatio: logo.width / logo.height }}
      >
        <Image src={logo} alt="Kazui logo" fill />
      </div>
      <h1 className="mt-2 text-2xl text-center font-semibold">
        Welcome to Kazui Portal
      </h1>
      <p className="mt-1 text-zinc-400 text-center">
        {
          "Since it's your first time here let's create you an account, so you can join the most badass  community."
        }
      </p>
      <Button
        onMouseDown={onClick}
        className="ml-auto mr-auto mt-3"
        variant="success"
        type="button"
      >
        Continue
      </Button>
    </motion.div>
  );
}

function Step1({ invisible, previous, next, form }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={twJoin(
        "flex flex-col transition-all duration-200 py-6 px-6 gap-3 leading-none",
        invisible && "!opacity-0 duration-300"
      )}
    >
      <div>
        <h1 className="text-2xl leading-none font-semibold">
          Choose a username
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormDescription className="text-zinc-400 text-sm">
                This is how others will find you.
              </FormDescription>
              <FormControl>
                <Input className="h-9" placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex mt-1">
        <Button
          onClick={previous}
          variant="link"
          className="h-9 flex gap-1 items-center mr-auto"
          type="button"
        >
          <BsArrowLeft className="mt-[0.1rem]" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-[0.40rem] w-[0.40rem] bg-gray-200 rounded-full" />
          <div className="h-[0.40rem] w-[0.40rem] bg-gray-600 rounded-full" />
          <div className="h-[0.40rem] w-[0.40rem] bg-gray-600 rounded-full" />
        </div>
        <Button
          onClick={next}
          className="ml-auto h-9"
          variant="success"
          type="button"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
function Step2({ invisible, previous, next, form }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={twJoin(
        "flex flex-col transition-all duration-200 py-6 px-6 gap-3 leading-none",
        invisible && "!opacity-0 duration-300"
      )}
    >
      <div>
        <h1 className="text-2xl leading-none font-semibold">
          Choose a nickname
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormDescription className="text-zinc-400 text-sm">
                This is your public display name.
              </FormDescription>
              <FormControl>
                <Input className="h-9" placeholder="Nickname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex mt-1">
        <Button
          onClick={previous}
          variant="link"
          className="h-9 flex gap-1 items-center mr-auto"
          type="button"
        >
          <BsArrowLeft className="mt-[0.1rem]" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-[0.40rem] w-[0.40rem] bg-gray-600 rounded-full" />
          <div className="h-[0.40rem] w-[0.40rem] bg-gray-200 rounded-full" />
          <div className="h-[0.40rem] w-[0.40rem] bg-gray-600 rounded-full" />
        </div>
        <Button
          onClick={next}
          className="ml-auto h-9"
          variant="success"
          type="button"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
function Step3({
  invisible,
  previous,
  next,
  form,
  submiting,
}: StepProps & { submiting: boolean }) {
  const [selected, setSelected] = useState<number | string>(0);
  useEffect(() => {
    if (typeof selected === "number")
      form.setValue("picture", `/profile-picture/default-${selected + 1}.svg`);
  }, [selected]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={twJoin(
        "flex flex-col transition-all duration-200 py-6 px-6 gap-3 leading-none",
        invisible && "!opacity-0 duration-300"
      )}
    >
      <div>
        <h1 className="text-2xl leading-none font-semibold">
          Choose a profile picture
        </h1>
      </div>
      <ProfilePictureSelector state={[selected, setSelected]} />
      <div className="flex mt-1">
        <Button
          onClick={previous}
          variant="link"
          className="h-9 flex gap-1 items-center mr-auto"
          type="button"
          disabled={submiting}
        >
          <BsArrowLeft className="mt-[0.1rem]" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-[0.40rem] w-[0.40rem] bg-gray-600 rounded-full" />
          <div className="h-[0.40rem] w-[0.40rem] bg-gray-600 rounded-full" />
          <div className="h-[0.40rem] w-[0.40rem] bg-gray-200 rounded-full" />
        </div>
        <Button
          disabled={submiting}
          onClick={next}
          className="ml-auto h-9"
          variant="success"
          type="submit"
          form="new-account"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
}

function Step4({ invisible, onClick }: EdgeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={twJoin(
        "flex flex-col items-center transition-all duration-200 py-11 px-10",
        invisible && "!opacity-0 duration-300"
      )}
    >
      <div
        className="text-7xl text-green-600"
        // style={{ aspectRatio: logo.width / logo.height }}
      >
        <FaCheckCircle />
      </div>
      <h1 className="mt-2 text-2xl text-center font-semibold">
        Your account has been created
      </h1>
      <p className="mt-1 text-zinc-400 text-center">
        {"You can already start using the community and earning rubis."}
      </p>
      <Button
        onMouseDown={onClick}
        className="ml-auto mr-auto mt-3"
        variant="success"
        type="button"
      >
        Done
      </Button>
    </motion.div>
  );
}

function ProfilePictureSelector({
  state,
}: {
  state: [number | string, Dispatch<SetStateAction<string | number>>];
}) {
  const [selected, setSelected] = state;
  return (
    <div className="grid grid-cols-5 gap-5 flex-wrap mt-3 justify-between justify-items-center">
      {Array(9)
        .fill(null)
        .map((x, i) => {
          return (
            <button
              key={i}
              className={twJoin(
                "h-20 w-20 rounded-full border-solid border-transparent border-0 relative overflow-hidden transition-all duration-300",
                i === selected && "!border-red-700 !border-4"
              )}
              onMouseDown={() => setSelected(i)}
              type="button"
            >
              <Image
                className="scale-[1.10] select-none pointer-events-none"
                alt="profile picture option"
                fill
                src={`/profile-picture/default-${i + 1}.svg`}
              />
            </button>
          );
        })}
      <button
        title="Upload picture"
        className={twJoin(
          "h-20 w-20 bg-gray-200 rounded-full border-gray-500 border relative overflow-hidden border-solid flex justify-center items-center transition-all duration-100",
          false && "!border-red-700 !border-4"
        )}
        type="button"
      >
        <LuUpload className="text-gray-500 text-3xl" />
        <Image
          className="scale-[1.10] hidden select-none pointer-events-none"
          alt="profile picture option"
          fill
          src={`/profile-picture/default-9.svg`}
        />
      </button>
    </div>
  );
}
