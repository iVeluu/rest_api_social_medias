import User from "../models/User.js";
import Follow from "../models/Follow.js";

export class FollowController {
  static follow = async (req, res) => {
    //Obtener la persona a la que seguiras
    const { followed } = req.body

    //Generar el follow
    const follow = new Follow({
        user: req.user.id,
        followed,
    })

    try {
        await follow.save()
        res.send("Follow!")
    } catch (error) {
        res.status(500).json({error: 'Hubo un Error'})
    }
  };

  static unfollow = async (req, res) => {
    //Obtener la persona a la que seguiras
    const { unfollowedId } = req.params;

    //Generar el follow
    const unfollow = await Follow.findOne({
      user: req.user.id,
      followed: unfollowedId,
    });

    if(!unfollow){
        return res.status(404).json({error: 'Hubo un Error!'})
    }

    try {
        await unfollow.deleteOne();
        res.send("Unfollow!")
    } catch (error) {
        res.status(500).json({error: 'Hubo un Error'})
    }
  };
}
