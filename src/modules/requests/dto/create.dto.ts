export class CreateRequestDto {
  title: string;
  body: string;
  contactMail?: string;
}

export class CreateResponseDto {
  requestUid: string;
  title: string;
  body: string;
  cancel: boolean;
}

export class CancelAllRequestsDto {
  title: string;
  body: string;
}
