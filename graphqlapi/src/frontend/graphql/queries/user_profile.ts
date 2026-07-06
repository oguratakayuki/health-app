import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID!) {
    userProfile(input: { id: $id }) {
      id
      gender
      height
      birthday
    }
  }
`;

export const EDIT_USER_PROFILE = gql`
  mutation EditUserProfile($input: EditUserProfileInput!) {
    editUserProfile(input: $input) {
      id
      gender
      height
      birthday
    }
  }
`;
