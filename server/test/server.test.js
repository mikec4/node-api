
const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');
const _=require('lodash');



var {app}=require('./../server');
var {Post}=require('./../models/post');
var {User}=require('./../models/user');
var {posts,populatePosts,users,populateUsers}=require('./seed');




before((done)=>{
    Post.remove({}).then(()=>{
        populatePosts(done);
    
    });
});
before((done)=>{
    User.remove({}).then(()=>{
    populateUsers(done);
    });
})

describe('POST /posts',()=>{

    it('should create new post',(done)=>{
    
        var text=posts[0].text;
        var _id=posts[0]._id;

        

        request(app)
        .post('/posts')
        .set('x-auth',users[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((e)=>{
            if(e)return done(e);

            Post.find().then((posts)=>{
                expect(posts.length).toBeGreaterThan(0);
                done();

            }).catch((e)=>done(e));
        });
    });

    it('should get 404 for the invalid data',(done)=>{
        
        var name="hello";
        request(app)
        .post('/posts')
        .set('x-auth',users[0].tokens[0].token)
        .send({name})
        .expect(404)
        .end(done);
    });
});


describe('GET /posts',()=>{

    it('should get all posts',(done)=>{

        request(app)
        .get('/posts')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .end((e,res)=>{
            if(e)return done(e);

            Post.find().then((posts)=>{
                
                expect(posts.length).toBeGreaterThan(0);
                done();
            }).catch((e)=>done(e));
        })
    });


});

describe('GET /posts/:id',()=>{

    it('should get post by id',(done)=>{
        var id=posts[0]._id.toHexString();
         
        request(app)
        .get(`/posts/${id}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(id);
            
        })
        .end(done);
    })

    it('should return 404 if invalid id',(done)=>{
      var id=123;
        request(app)
        .get(`/posts/${id}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })
});

describe('PATCH /posts',()=>{
  
  it('should update post',(done)=>{

      var id=posts[1]._id.toHexString();
      var text="Thank you Lord am finally doing well";
      
      request(app)
      .patch(`/posts/${id}`)
       .set('x-auth',users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res)=>{
          expect(res.body.text).toBe(text);
      })
      .end(done);
  });

  it('should return 400 for the unvailable id',(done)=>{

      var id=new ObjectID();
      var text='Maandazi';
      request(app)
      .patch(`/posts/${id}`)
      .set('x-auth',users[0].tokens[0].token)
      .send({text})
      .expect(400)
      .expect((res)=>{
          expect(res.body.text).toNotBe(text);
      })
      .end(done);
  });

  it('should return 404 for the invalid id',(done)=>{

      var id=123;
      var text='chukua';

      request(app)
      .patch(`/posts/${id}`)
       .set('x-auth',users[0].tokens[0].token)
      .send({text})
      .expect(404)
      .end(done);

  })
});

describe('DELETE /posts/id',()=>{
    it('should remove post by id',(done)=>{
        var id=posts[0]._id.toHexString();

        request(app)
        .delete(`/posts/${id}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .end((e,res)=>{
            if(e)return done(e);

            Post.find({}).then((posts)=>{
                expect(posts.length).toBe(2);
                done();
            }).catch((e)=>done(e));
        });
    });

    it('should return 404 not found if invalid id',(done)=>{
       
       var id=123;
        request(app)
        .delete(`/posts/${id}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
    it('should return 404 if id is not found',(done)=>{
             var id=new ObjectID().toHexString();

             request(app)
             .delete(`/posts/${id}`)
             .set('x-auth',users[0].tokens[0].token)
             .expect(400)
             .end(done);
    });
});


describe('DELETE /posts',()=>{
    it('should remove all posts',(done)=>{

        request(app)
        .delete('/posts')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .end((e,res)=>{
            if(e)return done(e);

            Post.find({}).then((posts)=>{
              expect(posts.length).toBe(0);
              done();
            }).catch((e)=>done(e));
        })
    })
});

describe('POST /users',()=>{
    it('should create a user',(done)=>{
      var email="a@example.com";
      var password="1234567";

     request(app)
     .post('/users')
     .send({
         email,password
     })
     .expect(200)
     .expect((res)=>{
         expect(res.body.user.email).toBe(email);
     })
     .end((e)=>{
         if(e)return done(e);

         User.find({}).then((users)=>{
             expect(users.length).toBeGreaterThan(2);
             done();
         }).catch((e)=>done(e));
     });
          
    })
    it('should return 400 if email is already taken',(done)=>{
        var email=users[0].email;
         var password=users[0].password;

       request(app)
       .post('/users') 
       .send({
        email,
        password
       })
       .expect(400)
       .end(done);
    })
})

describe('GET /users',()=>{
    it('should get all users',(done)=>{

        request(app)
        .get('/users')
        .expect(200)
        .expect((res)=>{
           expect(res.body.users.length).toBeGreaterThan(2);

        })
        .end(done);

    })
})
describe('GET /users/id',()=>{
    var id=users[0]._id.toHexString();
    var email=users[0].email;

    it('should get user by id',(done)=>{

        request(app)
        .get(`/users/${id}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.email).toBe(email);
        })
        .end(done);
    });
    it('should return 404 for invalid id',(done)=>{
        var id=123;

        request(app)
        .get(`/users/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 400 for an unvailable id',(done)=>{
       var id=new ObjectID();

        request(app)
        .get(`/users/${id}`)
        .expect(400)
        .end(done);

    })
})

describe('POST /users/login',()=>{
    it('should login a user',(done)=>{
        var email=users[0].email;
        var password=users[0].password;

        request(app)
        .post('/users/login')
        .send({email,password})
        .expect(200)
        .end(done);
    });
    it('should return 400 for the invalid email',(done)=>{

        var email="mim@x.com";
        var password="1234567";

        request(app)
        .post('/users/login')
        .send({email,password})
        .expect(400)
        .end(done);
    })

    it('should return 400 for the invalid password',(done)=>{

        var email=users[0].email;
        var password="abcdefghij";

        request(app)
        .post('/users/login')
        .send({email,password})
        .expect(400)
        .end(done);
    })
})

describe('DELETE /users/logout',()=>{

    it('should remove a token',(done)=>{

        request(app)
        .delete('/users/logout')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .end(done);
    })
})