import Follow from "../models/Follow.js";

export const followUserId = async ( identityUserId ) => {
    try {
        const following = await Follow.find({ user: identityUserId })
            .select({ "followed": 1, "_id": 0})
        
        const followers = await Follow.find({ followed: identityUserId }).select({
          "user": 1,
          "_id": 0,
        });

        const followingClean = []
        
        following.forEach(follow => {
            followingClean.push(follow.followed)
        })

        const followersClean = []

        followers.forEach(follow => {
            followersClean.push(follow.user);
        })
        return {
          followingClean,
          followersClean,
        };
    } catch (error) {
        res.status(500).json({error: 'Hubo un Error'})
    }
}

export const followThisUser = async ( identityUserId, profileUserId ) => {
    const following = await Follow.findOne({
      user: identityUserId,
      followed: profileUserId,
    });

    const follower = await Follow.findOne({
      user: profileUserId,
      followed: identityUserId,
    });

    return {
        following,
        follower
    }

}