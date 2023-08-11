import { signupAPI } from "@/app/utils/api/endpoints";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";

const SignUpForm = () => {
  const [firstName, setFirst] = useState<string>("");
  const [lastName, setLast] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [birthday, setBirthday] = useState<any>();
  const [confPassword, setConfirmed] = useState<string>("");

  const [validFirst, setValidFirst] = useState<boolean | undefined>(undefined);
  const [validLast, setValidLast] = useState<boolean | undefined>(undefined);
  const [validEmail, setEmailValid] = useState<boolean | null>(null);
  const [validPW, setValidPW] = useState<boolean | null>(null);
  const [validConf, setValidConf] = useState<boolean | null>(null);

  const [errors, setErrors] = useState<{ msg: string }[]>([]);

  const emailPattern = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  const pwPattern = new RegExp(/^.{8,}$/g);
  const namePattern = new RegExp(/.{1,}/g);

  const router = useRouter();
  const handleSignup = async (e: SyntheticEvent) => {
    e.preventDefault();
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        // birthday,
      }),
    };
    if (password === confPassword) {
      await fetch(signupAPI, opts)
        .then((res) => res.json())
        .then((data) => {
          if (data.errors) {
            setErrors(data.errors);
          }
          // success or DB error -- COMPLETE
          if (data.message) {
            if (data.message.includes("success")) {
              router.push("/login");
            } else {
              setErrors([{ msg: data.message }]);
            }
          }
          console.log(data);
        })
        .catch((err) => console.log(err));
    } else {
      setErrors([{ msg: "Passwords do not match." }]);
    }
  };

  return (
    <form
      className="text-white flex flex-col gap-2"
      onSubmit={(e) => handleSignup(e)}
    >
      <label className="flex flex-col">
        <span className="self-start text-white2">First Name</span>
        <input
          required
          type="text"
          className={`text-white w-full !bg-blue outline-none py-2 pl-4 pr-12 rounded border-solid border-b border-yellow2 
          ${validFirst && "valid"}`}
          onChange={(e) => {
            setFirst(e.target.value);
            setValidFirst(namePattern.test(e.target.value));
          }}
        />
      </label>
      <label className="flex flex-col">
        <span className="self-start text-white2">Last Name</span>
        <input
          required
          type="text"
          className={`text-white w-full !bg-blue outline-none py-2 pl-4 pr-12 rounded border-solid border-b border-yellow2
          ${validLast && "valid"}`}
          onChange={(e) => {
            setLast(e.target.value);
            setValidLast(namePattern.test(e.target.value));
          }}
        />
      </label>
      <label className="flex flex-col">
        <span className="self-start text-white2">
          Email{" "}
          {validEmail !== null && !validEmail && (
            <span className="text-xs text-error">Must be a valid email.</span>
          )}{" "}
        </span>
        <input
          required
          type="email"
          className={`text-white w-full !bg-blue outline-none py-2 pl-4 pr-12 rounded ${
            validEmail !== null && validEmail
              ? "valid"
              : validEmail !== null && !validEmail && "invalid"
          }  `}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailValid(emailPattern.test(e.target.value));
          }}
        />
      </label>
      <label className="flex flex-col">
        <span className="self-start text-white2">
          Password{" "}
          {validPW !== null && !validPW && (
            <span className="text-xs text-error">Minimum 8 characters.</span>
          )}
        </span>
        <input
          required
          type="password"
          className={`text-white w-full !bg-blue outline-none py-2 pl-4 pr-12 rounded border-solid border-b border-yellow2 ${
            validPW !== null && validPW
              ? "valid"
              : validPW !== null && !validPW && "invalid"
          }  `}
          onChange={(e) => {
            setPassword(e.target.value);
            setValidPW(pwPattern.test(e.target.value));
          }}
        />
      </label>
      <label className="flex flex-col">
        <span className="self-start text-white2">
          Confirm Password{" "}
          {password === confPassword ? (
            " "
          ) : (
            <span className="text-xs text-error">Passwords must match.</span>
          )}
        </span>

        <input
          required
          type="password"
          autoComplete="new-password"
          className={`text-white w-full !bg-blue outline-none py-2 pl-4 pr-12 rounded border-solid border-b border-yellow2 ${
            validConf !== null && validConf
              ? "valid"
              : validConf !== null && !validConf && "invalid"
          }  `}
          onChange={(e) => {
            setConfirmed(e.target.value);
            setValidConf(password === e.target.value);
          }}
        />
      </label>
      {/* <label className="flex flex-col">
          <span className="self-start text-green">Birthday</span>
          <input type="date" onChange={(e) => setBirthday(e.target.value)} />
        </label> */}
      {errors &&
        errors.map((err, i) => (
          <p key={i} className="text-error">
            {err.msg}
          </p>
        ))}
      <button
        type="submit"
        className="text-2xl text-center text-black bg-yellow rounded-2xl font-medium py-2 mt-6 w-full"
      >
        Sign up
      </button>
    </form>
  );
};

export default SignUpForm;
