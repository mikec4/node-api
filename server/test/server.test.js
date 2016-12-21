
const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');


var {app}=require('./../server');
var {Post}=require('./../models/post');
var {posts,populatePosts}=require('./seed');




before((done)=>{
    Post.remove({}).then(()=>{
        populatePosts(done);
    
    });
});

describe('POST /posts',()=>{

    it('should create new post',(done)=>{
    
        var text=posts[0].text;
        var _id=posts[0]._id;

        

        request(app)
        .post('/posts')
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
        .send({name})
        .expect(404)
        .end(done);
    });
});


describe('GET /posts',()=>{

    it('should get all posts',(done)=>{

        request(app)
        .get('/posts')
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
        .expect(404)
        .end(done);
    });
    it('should return 404 if id is not found',(done)=>{
             var id=new ObjectID().toHexString();

             request(app)
             .delete(`/posts/${id}`)
             .expect(400)
             .end(done);
    });
});


describe('DELETE /posts',()=>{
    it('should remove all posts',(done)=>{

        request(app)
        .delete('/posts')
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

