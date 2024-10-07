import { SignUp } from "@clerk/nextjs";

const Page = () => {
    return (
        <section className="relative flex flex-wrap lg:h-screen lg:items-center overflow-hidden">
            <div className="mb-[15px] flex items-center justify-center w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 bg-white">
                <SignUp />
            </div>

            <div className="relative mb-[40px] w-full sm:h-96 lg:h-full lg:w-1/2">
                <img
                    alt="Background Image"
                    src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </section>
    );
}

export default Page;
