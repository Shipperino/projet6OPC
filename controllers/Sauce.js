const fs = require('fs');
const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;
  const sauce = new Sauce({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
  });
  sauce.save()
    .then(() => res.status(201).json({
      message: 'Objet enregistré !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (Sauce) => {
      res.status(200).json(Sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.modifySauce = (req, res, next) => {
  const thingObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {
    ...req.body
  };
  Sauce.updateOne({
      _id: req.params.id
    }, {
      ...thingObject,
      _id: req.params.id
    })
    .then(() => res.status(200).json({
      message: 'Objet modifié !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({
            _id: req.params.id
          })
          .then(() => res.status(200).json({
            message: 'Objet supprimé !'
          }))
          .catch(error => res.status(400).json({
            error
          }));
      });
    })
    .catch(error => res.status(500).json({
      error
    }));
};
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.likedSauce = (req, res, next) => {
  const userid = req.body.userId

  Sauce.findOne({
      _id: req.params.id
    })
    .then(saucetolike => {
      if (req.body.like === 1) {

        console.log("kek", req.params.id)
        Sauce.updateOne({
            _id: req.params.id
          }, {
            $push: {
              usersLiked: userid
            },
            $inc: {
              likes: 1
            },
          }).then((sauce) => {
            res.status(200).json({
              message: "objet liké"
            })
          })
          .catch((error) => {
            res.status(500).json({
              error: error
            });
          });
      } else if (req.body.like === 0) {
        if (saucetolike.usersLiked.includes(userid)) {
          Sauce.updateOne({
              _id: req.params.id
            }, {
              $pull: {
                usersLiked: userid
              },
              $inc: {
                likes: -1
              },
            })
            .then((sauce) => {
              res.status(200).json({
                message: "like mis à jour"
              })
            })
            .catch((error) => {
              res.status(500).json({
                error: error
              });
            })
        } else if (saucetolike.usersDisliked.includes(userid)) {
          Sauce.updateOne({
              _id: req.params.id
            }, {
              $pull: {
                usersDisliked: userid
              },
              $inc: {
                dislikes: -1
              },
            }).then((sauce) => {
              res.status(200).json({
                message: "like mis à jour"
              })
            })
            .catch((error) => {
              res.status(500).json({
                error: error
              });
            })
        } else {
          res.status(200).json({
            message: "like mis à jour"
          });
        }
      } else if (req.body.like === -1) {
        Sauce.updateOne({
            _id: req.params.id
          }, {
            $push: {
              usersDisliked: userid
            },
            $inc: {
              dislikes: 1
            },
          })
          .then((sauce) => {
            res.status(200).json({
              message: "objet disliké"
            })
          })
          .catch((error) => {
            res.status(500).json({
              error: error
            });
          });
      }
    })
    .catch(error => res.status(500).json({
      error
    }));
}