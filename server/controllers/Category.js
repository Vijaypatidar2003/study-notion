const Category=require('../models/Category');
const Course = require('../models/Course');

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

//create category handler 
exports.createCategory=async (req,res)=>{
    try{
        //fetch data from req.body
        const {name,description}=req.body;

        //validation
        if(!name||!description){
            return res.status(401).json({
                success:false,
                message:'all fields are required'
            }) 
        }

        //create entry in Tags collection 
        const categoryDetails=await Category.create({name,description});

        return res.status(200).json({
            success:true,
            message:"tag created successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//getAllCategoriesHandlerFunction
exports.showAllCategories=async (req,res)=>{
    try {
        const allCategories = await Category.find()
        res.status(200).json({
          success: true,
          data: allCategories,
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }
}

//categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
  
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          
        })
        .exec()
  
      console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      console.log("above length1",selectedCategory)
      console.log("selected c",selectedCategory?.courses)
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
      console.log("below length")
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
      console.log("differentCategory",differentCategory);
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      console.log("all courses=",allCourses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
        console.log("most selling courses",mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }