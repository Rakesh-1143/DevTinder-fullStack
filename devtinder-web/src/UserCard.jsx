import React from "react";

function UserCard({ users }) {
  console.log(users);
  const { firstName, lastName, age, gender, about, skills, photoUrl } = users;
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img
            src={
              photoUrl ||
              "https://static.vecteezy.com/system/resources/previews/055/631/158/non_2x/young-woman-wearing-id-card-avatar-icon-for-social-media-profile-picture-vector.jpg"
            }
            alt="image uploaded soon"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + lastName}</h2>
          <p>{about}</p>
          <p>{age + "," + gender}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary">Ignore</button>
            <button className="btn btn-primary">Intersted</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
