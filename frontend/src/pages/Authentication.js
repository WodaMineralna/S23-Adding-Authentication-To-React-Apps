import { redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request, params }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login"; // 'login' is set as default, if "mode" is undefined

  if (mode !== "login" && mode !== "signup") {
    throw new Response(JSON.stringify({ message: "Unsupported mode." }), {
      status: 422,
    });
  }

  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const url = `http://192.168.1.18:8080/${mode}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    const data = await response.json();

    console.log(response); // DEBUGGING
    console.log(data); // DEBUGGING

    return data;
  }

  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: "Could not authenticate user." }),
      {
        status: 500,
      }
    );
  }

  // TODO: manage the token

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem("token", token);

  console.log(response); // DEBUGGING
  console.log(resData); // DEBUGGING

  return redirect("/");
}
