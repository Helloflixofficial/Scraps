// Params Calling From the Database 
const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  // userId verifying
  const userId = auth();
  if (!userId) {
    return;
    redirect("/");
  }

  //course id verifying
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });
  if (!course) {
    return redirect("/");
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // varify the data and cheking it all that data is proper given or something is missing by  `(${Method})`  ||   Data we have  /  Data we get   
  const requireFields = [
    course.title,
    course.imageUrl,
    course.description,
    course.price,
    course.categoryId,
  ];

  const totalField = requireFields.length;
  const completedField = requireFields.filter(Boolean).length;
  const completedData = `(${completedField} / ${totalField})`;


 // HTML = JSX
 ```
  return (
 <div className="p-6">
      <div className="flex items-center justify-center">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Coures Here</h1>
          <span>Completed Task{completedData}</span>
        </div>
      </div>
    </div>
    );
```



  
