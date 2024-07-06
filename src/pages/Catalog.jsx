import React, { useEffect,useState } from 'react'
import Course_Slider from '../components/core/Catalog/Course_Slider'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector'
import { categories } from '../services/apis'
import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import Course_Card from '../components/core/Catalog/Course_Card'

const Catalog = () => {

    const {catalogName} = useParams();
    const [catalogPageData,setCatalogPageData] = useState(null);
    const [categoryId,setCategoryId] = useState("");
    const [active,setActive] = useState(1);

    //fetch all categories
    useEffect(()=>{
        //whenever we click on one of the categoy in drop down url will change 
        //by comparing category name in the url with fetch categories we get the category id
        const getCategories = async ()=>{
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_Id = res?.data?.data.filter((ct)=>ct.name.split(" ").join("-").toLowerCase()===catalogName)[0]._id;
            setCategoryId(category_Id)
            console.log("set category=",category_Id)
        }
        getCategories();

    },[catalogName]);

    //fetch category page details whenever categoryId changes new data appears
    useEffect(()=>{
       if(categoryId){
            const getCategoryDetails = async ()=>{
                try{
                    const res = await getCatalogPageData(categoryId);
                    console.log("catalog page data=",res)
                    setCatalogPageData(res);
                }catch(error){
                    console.log(error);
                }
            }
            getCategoryDetails();
       }
    },[categoryId])

  return (
    <div className='text-white' >
        {/* Hero section  */}
        <div className='box-content bg-richblack-800 pl-[100px]'>
            <div  className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                <p className='text-lg text-richblack-300'>{`Home/Catalog/`}
                    <span className='text-yellow-300'>{catalogPageData?.data?.selectedCategory?.name}</span>
                </p>
                <p className="text-3xl text-richblack-5">
                    {catalogPageData?.data?.selectedCategory?.name}
                </p>
                <p className="max-w-[870px] text-richblack-200">
                    {catalogPageData?.data?.selectedCategory?.description}
                </p>
            </div>           
        </div>

        <div>
            {/* section 1 */}
            <div  className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className='text-4xl font-bold pb-4 pl-5'>Courses to get you started</div>
                <div className='flex gap-x-3'>
                    <p 
                        className={`py-2 px-4
                         ${active===1? "border-b border-b-yellow-200 text-yellow-200": "text-richblack-50"}
                         cursor-pointer`}                              
                        onClick={()=>setActive(1)}
                    
                    >Most Popular</p>
                    <p
                        className={`py-2 px-4
                        ${active===2? "border-b border-b-yellow-200 text-yellow-200": "text-richblack-50"}
                        cursor-pointer`}                              
                        onClick={()=>setActive(2)}>
                        New
                    </p>
                </div>
                <div className='py-6'>
                    <Course_Slider Courses={catalogPageData?.data?.selectedCategory?.courses}/>
                    {console.log("in catalog courses=",catalogPageData?.data?.selectedCategory?.courses)}
                </div>
            </div>

            {/* section 2  */}
            <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
                <div>Top Courses in {catalogPageData?.data?.differentCategory?.name}</div>
                <div className='py-8'>
                    <Course_Slider  Courses={catalogPageData?.data?.differentCategory?.courses}/>
                </div>
            </div>

            {/* section 3 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div>Frequently Bought </div>
                <div className='py-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-2'>
                        {catalogPageData?.data?.mostSellingCourses.slice(0,1).map((course,index)=>{
                           return  <Course_Card key={index} course={course} height={"h-[400px]"}/>
                        })

                        }

                    </div>


                </div>
            </div>
        </div>

        <Footer/>
    </div>
  )
}

export default Catalog